import sanitize from 'sanitize-filename'
import moment from 'moment'
// import { ipcMain } from 'electron'
import ActionType from '../../../actions/ActionType'
import { readdirAsync } from '../async'
import createNewTags from '../createNewTags'
import createOrUpdateNoteAndMeta from './createOrUpdateNoteAndMeta'
import { findNextName } from './index'
import dispatch from '../../dispatch'

export default obj => (
  readdirAsync(obj.dir)
    .then(data => {
      dispatch({ type: 'attempted pass of obj once it reaches createNote.js', obj })
      const name = obj.note.title ? `${sanitize(obj.note.title)}` : (
        `${moment().format('YYYY-MM-DD[T]H_mm_ss.SSSZ').replace(/:/g, '_')}`
      )
      const fileName = findNextName(name, data)

      return createNewTags(obj.path, obj.newTags)
        .then(newTagsObj => {
          const newMeta = obj.meta
          newMeta.tagIDs = obj.meta.tagIDs.concat(newTagsObj.newTagIds)

          return createOrUpdateNoteAndMeta({
            note: obj.note,
            meta: newMeta,
            fileName,
            dir: obj.dir,
            type: ActionType.App.Notes.CREATE_NOTE_SUCCESS
          })
        })
    })
)
