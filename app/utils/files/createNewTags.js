import { readFileAsync, writeFileAsync } from './async'
import dispatch from '../dispatch'
import ActionType from '../../actions/ActionType'

export default (settingsPath, newTags) => {
  if (newTags.length) {
    return readFileAsync(settingsPath)
    .then(data => JSON.parse(data))
    .then(settings => {
      const newSettings = settings
      const newTagIds = []
      newTags.forEach(tag => {
        newTagIds.push(newSettings.nextTagId)
        newSettings.tagsByID[newSettings.nextTagId] = {
          id: settings.nextTagId,
          name: tag,
          path: tag,
          parent: null,
        }
        newSettings.nextTagId += 1
      })
      return { newSettings, newTagIds }
    })
    .then(obj => (
      writeFileAsync(settingsPath, JSON.stringify(obj.newSettings, null, 2))
      .then(() => dispatch({
        type: ActionType.App.Setup.USER_SETTINGS_RETRIEVED,
        settings: obj.newSettings
      }))
      .then(() => obj)
    ))
  }
  return Promise.resolve({ newTagIds: [] })
}
