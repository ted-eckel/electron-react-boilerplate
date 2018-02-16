import dispatch from '../../dispatch'
import { writeFileAsync, statAsync } from '../async'
import ActionType from '../../../actions/ActionType'

export default obj => (
  writeFileAsync(`${obj.dir}${obj.fileName}`, obj.note.content)
    .then(() => writeFileAsync(`${obj.dir}.${obj.fileName}.json`, JSON.stringify(obj.meta, null, 2)))
    .then(() => statAsync(`${obj.dir}${obj.fileName}`))
    .then(stats => Date.parse(stats.birthtime))
    .then(date => dispatch({
      type: obj.type,
      file: {
        path: `${obj.dir}${obj.fileName}`,
        date,
        folder: obj.dir,
        meta: obj.meta,
        name: obj.fileName,
        oldFilePath: (
          obj.type === ActionType.App.Notes.UPDATE_NOTE_SUCCESS ?
            `${obj.dir}${obj.oldFileName}` :
            null
        ),
        service: 'file'
      }
    }))
)
