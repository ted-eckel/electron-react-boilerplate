import trash from 'trash'
import dispatch from '../../dispatch'
import ActionType from '../../../actions/ActionType'

export default (info, meta, filePath) => {
  const filesToTrash = [filePath]
  if (meta) filesToTrash.push(`${info.folder}.${info.name}.json`)
  return trash(filesToTrash).then(() => dispatch({
    type: ActionType.App.Notes.TRASH_SUCCESS,
    filePath
  }))
}
