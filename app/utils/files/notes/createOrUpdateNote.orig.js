import sanitize from 'sanitize-filename'
import moment from 'moment'
import { readdirAsync, writeFileAsync, statAsync } from '../async'
import ActionType from '../../../actions/ActionType'
import dispatch from '../../dispatch'
import createNewTags from '../createNewTags'

const findNextName = (name, dirArray, i = 0) => {
  if (dirArray.includes(`${name}.html`)) {
    return findNextName(`${name} (${i + 1})`, dirArray, (i + 1))
  }
  return `${name}.html`
}
// see if there's a file name. if not, no rename. if there is,
// see if there's a title. if there is, and it's different, call renameAsync, if not, don't.
// set successType accordingly
// check for newTags length in the createNewTags function

// the problem with renaming it is that it'll create a new note in the list...
// meaning we'd have to delete it in the thing and replace it w/ new path

export default (obj/* note, meta, dir, newTags = [], path */) => (
  readdirAsync(obj.dir)
    .then(data => {
      const name = obj.note.title ? `${sanitize(obj.note.title)}` : (
        `${moment().format('YYYY-MM-DD[T]H_mm_ss.SSSZ').replace(/:/g, '_')}`
      )
      const fileName = obj.findNextName(name, data)

      return createNewTags(obj.path, obj.newTags)
        .then(newObj => {
          const newMeta = obj.meta
          newMeta.tagIDs = obj.meta.tagIDs.concat(newObj.newTagIds)
          return createOrUpdateNoteAndMeta(
            obj.note,
            newMeta,
            fileName,
            obj.dir,
            ActionType.App.Notes.CREATE_NOTE_SUCCESS
          )
        })
    })
)

const createOrUpdateNoteAndMeta = (note, meta, fileName, dir, type) => (
  writeFileAsync(`${dir}${fileName}`, note.content)
    .then(() => writeFileAsync(`${dir}.${fileName}.json`, JSON.stringify(meta, null, 2)))
    .then(() => statAsync(`${dir}${fileName}`))
    .then(stats => Date.parse(stats.birthtime))
    .then(date => dispatch({
      type,
      file: {
        path: `${dir}${fileName}`,
        date,
        folder: dir,
        meta,
        name: fileName,
        service: 'file'
      }
    }))
)
