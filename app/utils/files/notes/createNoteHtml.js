import moment from 'moment'
import { JSDOM } from 'jsdom'
import htmlString from './htmlString'
import createNoteUtil from './createNote'
import updateNoteUtil from './updateNote'
import dispatch from '../../dispatch'

export default obj => {
  dispatch({ type: 'obj in createNoteHtml', obj })
  const { document } = (new JSDOM(htmlString)).window
  dispatch({ type: 'attempted pass of JSDOM document object', document })
  // const parser = new DOMParser()
  // const doc = parser.parseFromString(htmlString, 'text/html')
  const noteNode = document.getElementsByClassName('note')[0]
  if (obj.meta.color) {
    noteNode.className += ` ${obj.meta.color}`
  }

  const headingText = `${moment().format('MMM D YYYY, h:mm:ss A')}`
  document.getElementsByClassName('heading')[0].innerText = headingText

  if (obj.note.title) {
    document.title = obj.note.title
    const titleNode = document.createElement('div')
    titleNode.className = 'title'
    titleNode.innerText = obj.note.title
    noteNode.appendChild(titleNode)
  } else {
    document.title = headingText
  }

  if (obj.note.content) {
    const contentNode = document.createElement('div')
    contentNode.className = 'content'
    contentNode.innerHTML = obj.note.content
    noteNode.appendChild(contentNode)
  }

  if (obj.meta.tagIDs.length || obj.newTags.length) {
    const tags = obj.meta.tagIDs.map(tagID => obj.tagsByID[tagID].name)
      .concat(obj.newTags)

    const labelsNode = document.createElement('div')
    labelsNode.className = 'labels'
    labelsNode.innerHTML = tags.map(tag => `<span class="label">${tag}</span>`).join('')
    noteNode.appendChild(labelsNode)
  }

  dispatch({ type: 'attempted pass of altered JSDOM document object', document })

  if (obj.note.name) {
    return updateNoteUtil({
      ...obj,
      note: { ...obj.note, content: document.documentElement.outerHTML }
    })
  }

  return createNoteUtil({
    ...obj,
    note: { ...obj.note, content: document.documentElement.outerHTML }
  })
}
