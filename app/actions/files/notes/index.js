import { remote } from 'electron'
// import moment from 'moment'
// import htmlString from './htmlString'
import ActionType from '../../ActionType'
import createNoteHtml from './createNoteHtml'

const NoteUtil = remote.require('./utils/files/notes')
// const createNoteUtil = remote.require('./utils/files/notes/createNote')
// const updateNoteUtil = remote.require('./utils/files/notes/updateNote')
const readNoteUtil = remote.require('./utils/files/notes/readNote')
// const createNoteHtml = remote.require('./utils/files/notes/createNoteHtml')
// const createOrUpdateNoteUtil = remote.require('./utils/files/notes/createOrUpdateNote')


// export const createOrUpdateNote = (note, meta, dir, newTags = []) => (dispatch, getState) => {
//   const path = getState().paths
//   const type = note.name ?
//     ActionType.App.Notes.UPDATE_NOTE_REQUEST :
//     ActionType.App.Notes.CREATE_NOTE_REQUEST
//
//   dispatch({
//     type,
//     note,
//     meta,
//     dir,
//     newTags
//   })
//
//   const obj = {
//     note,
//     meta,
//     dir,
//     newTags,
//     path: path.USER_SETTINGS,
//     tagsByID: getState().settings.tagsByID
//   }
//
//   return createNoteHtml(obj)
// }

export const createOrUpdateNote = obj => (dispatch, getState) => {
  const path = getState().paths
  const type = obj.name ?
    ActionType.App.Notes.UPDATE_NOTE_REQUEST :
    ActionType.App.Notes.CREATE_NOTE_REQUEST

  dispatch({
    type,
    ...obj
  })

  return createNoteHtml({
    path: path.USER_SETTINGS,
    tagsByID: getState().settings.tagsByID,
    type,
    ...obj
  })
}

export const archiveNote = (noteInfo, meta, filePath) => (dispatch, getState) => {
  const path = getState().paths

  dispatch({
    type: ActionType.App.Notes.ARCHIVE_REQUEST,
    noteInfo,
    meta,
    filePath
  })

  return NoteUtil.updateNoteMeta(noteInfo, meta, [], path.USER_SETTINGS)
}

export const trashNote = (noteInfo, meta, filePath) => dispatch => {
  dispatch({
    type: ActionType.App.Notes.TRASH_REQUEST,
    filePath,
    meta,
    noteInfo
  })

  return NoteUtil.trashNote(noteInfo, meta, filePath)
}

export const openNote = item => dispatch => {
  dispatch({
    type: ActionType.App.View.OPEN_CREATE_NOTE_MODAL
  })

  dispatch({
    type: ActionType.App.Notes.UPDATE_CREATED_NOTE_STATE,
    file: item
  })

  dispatch({
    type: ActionType.App.Notes.OPEN_NOTE_REQUEST,
    item
  })

  return readNoteUtil(item)
}

export const updateNoteMeta = (noteInfo, meta, newTags = []) => (dispatch, getState) => {
  const path = getState().paths
  dispatch({
    type: ActionType.App.Notes.UPDATE_NOTE_REQUEST,
    noteInfo,
    meta,
    newTags
  })

  return NoteUtil.updateNoteMeta(noteInfo, meta, newTags, path.USER_SETTINGS)
}

export const importGoogleKeepNotes = (
  pathsArray,
  metaArray,
  attachmentArray,
  attachmentMetaArray
) => (
  dispatch, getState
) => {
  const path = getState().paths
  dispatch({
    type: ActionType.App.Notes.IMPORT_KEEP_NOTES_REQUEST,
    pathsArray,
    metaArray,
    attachmentArray,
    attachmentMetaArray
  })

  return NoteUtil.importGoogleKeepNotes(
    pathsArray,
    metaArray,
    attachmentArray,
    attachmentMetaArray,
    path.DEFAULT_NOTES_DIR
  )
}
