import sanitize from 'sanitize-filename'
import moment from 'moment'
import ActionType from '../../../actions/ActionType'
import createNewTags from '../createNewTags'
import createOrUpdateNoteAndMeta from './createOrUpdateNoteAndMeta'
import { findNextName } from './index'
import { readdirAsync, renameAsync } from '../async'

export default obj => (
  readdirAsync(obj.dir)
    .then(data => {
      const oldFileName = obj.note.name
      const name = obj.note.title ? `${sanitize(obj.note.title)}` : (
        `${moment().format('YYYY-MM-DD[T]H_mm_ss.SSSZ').replace(/:/g, '_')}`
      )
      const fileName = findNextName(name, data)

      return renameAsync(`${obj.dir}${oldFileName}`, `${obj.dir}${fileName}`)
        .then(() => renameAsync(`${obj.dir}.${oldFileName}.json`, `${obj.dir}.${fileName}.json`))
        .then(() => createNewTags(obj.path, obj.newTags))
        .then(newTagsObj => {
          const newMeta = obj.meta
          newMeta.tagIDs = obj.meta.tagIDs.concat(newTagsObj.newTagIds)
          return createOrUpdateNoteAndMeta({
            note: obj.note,
            meta: newMeta,
            fileName,
            oldFileName,
            dir: obj.dir,
            type: ActionType.App.Notes.UPDATE_NOTE_SUCCESS
          })
        })
    })
)
