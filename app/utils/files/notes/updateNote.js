// @flow
import sanitize from 'sanitize-filename'
import moment from 'moment'
import ActionType from '../../../actions/ActionType'
import createNewTags from '../createNewTags'
import createOrUpdateNoteAndMeta from './createOrUpdateNoteAndMeta'
import { findNextName } from './index'
import { readdirAsync, renameAsync } from '../async'

export default (obj: {
  path: string,
  tagsByID: {
    [tagID: string | number]: {
      id: string | number,
      name: string,
      parent: null | string | number
    }
  },
  type: string,
  content: string,
  state: string,
  dir: string,
  name: ?string,
  tagIDs: Array,
  newTags: Array,
  title: string,
  color: ?string,
  noteContent: string,
  metaContent: string
}) => (
  readdirAsync(obj.dir)
    .then(data => {
      const oldFileName = obj.name
      // there needs to be a check for oldTitle, to see if it's different from the new title...
      // fixing the bug that it will rename a unique title with (1)
      const name = obj.title ? `${sanitize(obj.title)}` : (
        `${moment().format('YYYY-MM-DD[T]H_mm_ss.SSSZ').replace(/:/g, '_')}`
      )
      const fileName = findNextName(name, data)

      // to make updateNote and createNote one function, you could make a rename function
      // that either points to renameAsync or a promise that resolves immediately depending on
      // whether or not there's an existing name / the request type

      return renameAsync(`${obj.dir}${oldFileName}`, `${obj.dir}${fileName}`)
        .then(() => renameAsync(`${obj.dir}.${oldFileName}.json`, `${obj.dir}.${fileName}.json`))
        .then(() => createNewTags(obj.path, obj.newTags))
        .then(newTagsObj => {
          // const newMeta = obj.meta
          // newMeta.tagIDs = obj.meta.tagIDs.concat(newTagsObj.newTagIds)
          const tagIDs = obj.tagIDs.concat(newTagsObj.newTagIds)
          return createOrUpdateNoteAndMeta({
            // note: obj.note,
            // meta: newMeta,
            // fileName,
            // oldFileName,
            // dir: obj.dir,
            // type: ActionType.App.Notes.UPDATE_NOTE_SUCCESS
            ...obj,
            fileName,
            oldFileName,
            tagIDs,
            type: ActionType.App.Notes.UPDATE_NOTE_SUCCESS
          })
        })
    })
)
