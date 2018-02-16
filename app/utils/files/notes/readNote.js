import { JSDOM } from 'jsdom'
import { readFileAsync } from '../async'
import dispatch from '../../dispatch'
import ActionType from '../../../actions/ActionType'

export default item => (
  readFileAsync(item.path)
    .then(uint8 => new Buffer(uint8 || '', 'base64').toString('utf8'))
    .then(data => {
      const { document } = (new JSDOM(data)).window
      // const parser = new DOMParser()
      // const doc = parser.parseFromString(data, 'text/html')

      const noteNode = document.getElementsByClassName('note')[0]
      // console.log(noteNode)
      const contentNode = document.getElementsByClassName('content')[0]
      // console.log(contentNode)
      const content = noteNode ? (contentNode.innerHTML || '') : data
      // console.log(content)

      return dispatch({
        type: ActionType.App.Notes.UPDATE_CREATED_NOTE_STATE,
        file: { ...item, content }
      })
    })
)
