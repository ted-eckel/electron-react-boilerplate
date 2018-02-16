import { createEditorState } from 'medium-draft'
import { convertFromRaw } from 'draft-js'
import exporter from './exporter'
import importer from './importer'
import createNoteHtml from './createNoteHtml'
import dispatch from '../../dispatch'

export default obj => {
  dispatch({ type: 'received note and meta', obj })
  // const content = exporter(createEditorState(convertFromRaw(obj.note.content)).getCurrentContent())
  const content = exporter(createEditorState(convertFromRaw(obj.note.content)).getCurrentContent())
  // dispatch({ type: 'attempted converted raw content', convertedRawObj })
  return createNoteHtml({
    note: { content, ...obj.note },
    meta: { content, ...obj.meta },
    ...obj
  })
}
