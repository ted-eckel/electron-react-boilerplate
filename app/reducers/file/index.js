import { combineReducers } from 'redux'
import ActionType from '../../actions/ActionType'
import app from './app'
import { htmlConvert } from '../../utils/files/notes'
import importer from '../../utils/files/notes/importer'
// import mediumDraftImporter from 'medium-draft/lib/importer'
// import { convertToRaw } from 'draft-js'

const archivedFilePaths = (state = [], action) => {
  switch (action.type) {
    case ActionType.App.Files.RETRIEVE_SUCCESS:
      return [...state, ...action.archivedFilePaths]
    default:
      return state
  }
}

const filesByPath = (state = {}, action) => {
  switch (action.type) {
    case ActionType.App.Files.RETRIEVE_SUCCESS:
      return { ...state, ...action.filesByPath }
    case ActionType.App.Notes.CREATE_NOTE_SUCCESS:
      return { ...state, [action.file.path]: action.file }
    case ActionType.App.Notes.UPDATE_NOTE_SUCCESS:
      return { ...state, [action.file.path]: action.file }
    case ActionType.App.Files.UPDATE_FILE_META_SUCCESS:
      return { ...state, [action.path]: { ...state[action.path], meta: action.meta } }
    default:
      return state
  }
}

const fileListByQuery = (state = { '': [] }, action) => {
  switch (action.type) {
    case ActionType.App.Files.RETRIEVE_SUCCESS:
      return { '': [...state[''], ...Object.keys(action.filesByPath)] }
    case ActionType.App.Notes.CREATE_NOTE_SUCCESS:
      return { '': [...state[''], action.file.path] }
    case ActionType.App.Notes.TRASH_REQUEST:
      return removeNote(state, action.filePath, /^$/)
    case ActionType.App.Notes.ARCHIVE_REQUEST:
      return removeNote(state, action.filePath, /^$/)
    case ActionType.App.Notes.UNARCHIVE_REQUEST:
      return removeMatchingSearches(state, /^$/)
    case ActionType.App.Notes.DELETE_REQUEST:
      return removeNote(state, action.filePath, /^$/)
    case ActionType.App.Notes.UPDATE_NOTE_SUCCESS:
      return updateNote(state, action.file.oldFilePath, /^$/, action.file.path)
    default:
      return state
  }
}

const init = (state = null, action) => {
  switch (action.type) {
    case ActionType.App.Files.INIT_FAILURE:
      return false
    case ActionType.App.Files.INIT_SUCCESS:
      return true
    default:
      return state
  }
}

const isRetrieving = (state = false, action) => {
  switch (action.type) {
    case ActionType.App.Files.RETRIEVE_REQUEST:
      return true
    case ActionType.App.Files.RETRIEVE_SUCCESS:
      return false
    case ActionType.App.Files.RETRIEVE_FAILURE:
      return false
    default:
      return state
  }
}

const nextFilePaths = (state = null, action) => {
  switch (action.type) {
    case ActionType.App.Files.INIT_SUCCESS:
      return action.nextFilePaths
    case ActionType.App.Files.RETRIEVE_SUCCESS:
      return action.nextFilePaths
    default:
      return state
  }
}

const createdNote = (state = {
  path: 'new',
  name: '',
  content: htmlConvert(''),
  // content: null,
  folder: null,
  meta: {
    color: 'DEFAULT',
    tagIDs: [],
    title: '',
    folder: null,
  }
}, action) => {
  switch (action.type) {
    case ActionType.App.View.TOGGLE_CREATE_NOTE_MODAL:
      if (action.file) {
        return {
          path: action.file.path,
          name: action.file.name,
          meta: action.file.meta,
          folder: action.file.folder,
          content: importer(action.file.content) /* htmlConvert(action.file.content), */
          // content: convertToRaw(mediumDraftImporter(action.file.content)),
        }
      }
      return state
    case ActionType.App.Notes.UPDATE_CREATED_NOTE_STATE:
      if (action.file) {
        return {
          path: action.file.path,
          name: action.file.name,
          meta: action.file.meta,
          folder: action.file.folder,
          content: action.file.content ?
            importer(action.file.content) :
            importer(action.file.meta.content)
        }
      }
      return state
    case ActionType.App.View.CLOSE_CREATE_NOTE_MODAL:
      return {
        path: 'new',
        name: '',
        content: htmlConvert(''),
        // content: null,
        folder: null,
        meta: {
          color: 'DEFAULT',
          tagIDs: [],
          title: '',
          folder: null,
        }
      }
    default:
      return state
  }
}

function removeNote(fileListByQueryState, filePathToRemove, searchRegex) {
  return Object.keys(fileListByQueryState)
    .reduce((newFileListByQuery, search) => {
      if (searchRegex.test(search)) {
        const existingFileList = fileListByQueryState[search]
        const newFilePaths = existingFileList.filter(
          filePath => filePath !== filePathToRemove
        )
        if (newFilePaths.length < existingFileList.length) {
          newFileListByQuery[search] = newFilePaths
        } else {
          newFileListByQuery[search] = existingFileList
        }
      }

      return newFileListByQuery
    }, {})
}

function updateNote(fileListByQueryState, filePathToRemove, searchRegex, newPath) {
  return Object.keys(fileListByQueryState)
    .reduce((newFileListByQuery, search) => {
      if (searchRegex.test(search)) {
        const existingFileList = fileListByQueryState[search]
        const newFilePaths = existingFileList.filter(
          filePath => filePath !== filePathToRemove
        )
        if (newFilePaths.length < existingFileList.length) {
          newFileListByQuery[search] = newFilePaths
        } else {
          newFileListByQuery[search] = existingFileList
        }
      }

      return { [search]: [...newFileListByQuery[search], newPath] }
    }, {})
}

function removeMatchingSearches(fileListByQueryState, searchRegex) {
  return Object.keys(fileListByQueryState)
    .reduce((newFileListByQuery, search) => {
      if (!searchRegex.test(search)) {
        newFileListByQuery[search] = fileListByQueryState[search]
      }

      return newFileListByQuery
    }, {})
}

export default combineReducers({
  app,
  archivedFilePaths,
  createdNote,
  filesByPath,
  fileListByQuery,
  init,
  isRetrieving,
  nextFilePaths
})
