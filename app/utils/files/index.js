import { readdirAsync, statAsync, readFileAsync, writeFileAsync } from './async'
import dispatch from '../dispatch'
import path from '../../path'
import ActionType from '../../actions/ActionType'

const folders = {}
const jsonPaths = {}
const filePaths = {}

export function initFiles(foldersArray) {
  Promise.all(foldersArray.map(folder => readdirAsync(folder).then(contents => (
    folders[folder] = contents
  ))))
  .then(() => Promise.all(foldersArray.map(folder => folders[folder].forEach(name => {
    const match = /^.*\.json$/g.exec(name)

    if (name !== '.DS_Store') {
      if (match) {
        jsonPaths[`${folder}${name}`] = { folder, name, path: `${folder}${name}` }
      } else {
        filePaths[`${folder}${name}`] = {
          folder,
          name,
          path: `${folder}${name}`,
          service: 'file'
        }
      }
    }
  }))))
  .then(() => Promise.all(Object.keys(filePaths).map(filePath => (
    statAsync(filePath).then(stats => (filePaths[filePath].date = Date.parse(stats.birthtime)))
  ))))
  .then(() => {
    const nextFilePaths = (
      Object.keys(filePaths)
      .sort((a, b) => filePaths[b].date - filePaths[a].date)
      .map(filePath => filePaths[filePath])
    )

    return dispatch({
      type: ActionType.App.Files.INIT_SUCCESS,
      nextFilePaths
    })
  })
  .catch(err => dispatch({ type: ActionType.App.Files.INIT_FAILURE, err }))
}

const processFile = (
  file,
  i,
  filesByPathObj,
  archivedFilePaths
) => new Promise((resolve, reject) => {
  const filesByPath = filesByPathObj
  const jsonPath = `${file.folder}.${file.name}.json`
  if (jsonPaths[jsonPath]) {
    readFileAsync(jsonPath)
    .then(data => JSON.parse(data))
    .then(json => {
      if (json.state === 'INBOX') {
        filesByPath[file.path] = ({ ...file, meta: json })
      } else {
        archivedFilePaths.push({ ...file, meta: true })
      }
      return resolve({ filesByPath, archivedFilePaths, i: i + 1 })
    }).catch(err => reject(err))
  } else {
    filesByPath[`${file.path}`] = { ...file, meta: false }
    resolve({ filesByPath, archivedFilePaths, i: i + 1 })
  }
})

const next = (files, i = 0, filesByPath = {}, archivedFilePaths = []) => (
  processFile(files[i], i, filesByPath, archivedFilePaths).then(result => {
    if (result.i < files.length && Object.keys(result.filesByPath).length < 20) {
      return next(files, result.i, result.filesByPath, result.archivedFilePaths)
    }
    return {
      filesByPath: result.filesByPath,
      archivedFilePaths: result.archivedFilePaths,
      nextFilePaths: files.slice(result.i)
    }
  })
)

export const getMetaData = files => next(files).then(result => (
  dispatch({
    type: ActionType.App.Files.RETRIEVE_SUCCESS,
    filesByPath: result.filesByPath,
    archivedFilePaths: result.archivedFilePaths,
    nextFilePaths: result.nextFilePaths
  })
)).catch(err => dispatch({ type: ActionType.App.Files.RETRIEVE_FAILURE, err }))

export const createTag = tagString => (
  readFileAsync(path.USER_SETTINGS)
  .then(data => JSON.parse(data))
  .then(json => {
    const settings = json
    const nextTagId = settings.nextTagId
    settings.tagsByID[`${nextTagId}`] = { id: nextTagId, name: tagString, parent: null }
    settings.nextTagId = nextTagId + 1
    return writeFileAsync(path.USER_SETTINGS, settings)
  })
  .then(settings => writeFileAsync(path.USER_SETTINGS, settings))
  .then(data => dispatch({
    type: ActionType.App.Files.CREATE_TAG_SUCCESS,
    data
  }))
)
