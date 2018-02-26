// @flow
import dispatch from '../../dispatch'
import { writeFileAsync, statAsync } from '../async'

export default (obj: {
  path: string,
  tagsByID: {
    [tagID: string | number]: {
      id: string | number,
      name: string,
      parent: null | string | number
    }
  },
  content: string,
  state: string,
  dir: string,
  name: ?string,
  tagIDs: Array,
  newTags: Array,
  title: string,
  color: ?string,
  noteContent: string,
  metaContent: string,
  fileName: string,
  oldFileName?: string,
  tagIDs: Array,
  type: string
}) => (
  writeFileAsync(`${obj.dir}${obj.fileName}`, obj.noteContent)
    .then(() => (writeFileAsync(`${obj.dir}.${obj.fileName}.json`, JSON.stringify({
      title: obj.title,
      color: obj.color,
      tagIDs: obj.tagIDs,
      content: obj.metaContent,
      state: obj.state
    }, null, 2))))
    .then(() => statAsync(`${obj.dir}${obj.fileName}`))
    .then(stats => Date.parse(stats.birthtime))
    .then(date => dispatch({
      type: obj.type,
      file: {
        path: `${obj.dir}${obj.fileName}`,
        date,
        folder: obj.dir,
        meta: {
          title: obj.title,
          color: obj.color,
          tagIDs: obj.tagIDs,
          content: obj.metaContent,
          state: obj.state
        },
        name: obj.fileName,
        oldFilePath: obj.oldFileName ? `${obj.dir}${obj.oldFileName}` : null,
        service: 'file'
      }
    }))
)
