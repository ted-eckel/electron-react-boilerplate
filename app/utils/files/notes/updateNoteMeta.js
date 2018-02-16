import { readFileAsync, writeFileAsync } from '../async'
import ActionType from '../../../actions/ActionType'
import dispatch from '../../dispatch'
import createNewTags from '../createNewTags'

export default (info, meta, newTags = [], settingsPath) => {
  if (newTags.length) {
    return createNewTags(settingsPath, newTags)
    .then(obj => (
      readFileAsync(`${info.folder}.${info.name}.json`)
      .then(data => JSON.parse(data))
      .then(currentMeta => {
        const newMeta = currentMeta
        Object.keys(meta).forEach(key => (newMeta[key] = meta[key]))
        newMeta.tagIDs = meta.tagIDs.concat(obj.newTagIds)
        return writeFileAsync(
          `${info.folder}.${info.name}.json`,
          JSON.stringify(newMeta, null, 2)
        )
        .then(() => dispatch({
          type: ActionType.App.Files.UPDATE_FILE_META_SUCCESS,
          path: `${info.folder}${info.name}`,
          newMeta
        }))
      })
    ))
  }

  return readFileAsync(`${info.folder}.${info.name}.json`)
  .then(data => JSON.parse(data))
  .then(currentMeta => {
    const newMeta = currentMeta
    Object.keys(meta).forEach(key => (newMeta[key] = meta[key]))
    return writeFileAsync(`${info.folder}.${info.name}.json`, JSON.stringify(newMeta))
    .then(() => dispatch({
      type: ActionType.App.Files.UPDATE_FILE_META_SUCCESS,
      path: `${info.folder}${info.name}`,
      newMeta
    }))
  })
}
