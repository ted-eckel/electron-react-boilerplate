import { remote } from 'electron'
import moment from 'moment'
import * as Jimp from 'jimp'
import htmlString from './htmlString'
import exporter from '../../../utils/files/notes/exporter'

const createNoteUtil = remote.require('./utils/files/notes/createNote')
const updateNoteUtil = remote.require('./utils/files/notes/updateNote')

const base64ThumbAsync = base64Data => new Promise((resolve, reject) => (
  Jimp.read(Buffer.from(base64Data, 'base64'))
    .then(image => (
      image.resize(240, Jimp.AUTO)
        .getBase64(Jimp.AUTO, (err, thumbnail) => {
          if (err) return reject(err)
          resolve(thumbnail)
        })
    ))
))

export default obj => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  const noteNode = doc.getElementsByClassName('note')[0]
  if (obj.color) {
    noteNode.className += ` ${obj.color}`
  }

  const headingText = `${moment().format('MMM D YYYY, h:mm:ss A')}`
  doc.getElementsByClassName('heading')[0].innerText = headingText

  if (obj.title) {
    doc.title = obj.title
    const titleNode = doc.createElement('div')
    titleNode.className = 'title'
    titleNode.innerText = obj.title
    noteNode.appendChild(titleNode)
  } else {
    doc.title = headingText
  }

  // const content = exporter(obj.editorState)
  const { content } = obj
  if (content) {
    const contentNode = doc.createElement('div')
    contentNode.className = 'content'
    contentNode.innerHTML = content
    noteNode.appendChild(contentNode)
  }

  if (obj.tagIDs.length || obj.newTags.length) {
    const tags = obj.tagIDs.map(tagID => obj.tagsByID[tagID].name)
      .concat(obj.newTags)

    const labelsNode = doc.createElement('div')
    labelsNode.className = 'labels'
    labelsNode.innerHTML = tags.map(tag => `<span class="label">${tag}</span>`).join('')
    noteNode.appendChild(labelsNode)
  }

  const metaParser = new DOMParser()
  const metaDoc = metaParser.parseFromString(content, 'text/html')
  const images = metaDoc.getElementsByTagName('img')
  console.log(images)

  const promiseArr = []

  for (let i = 0; i < images.length; i += 1) {
    const img = images[i]
    const base64Data = img.src.replace(/^data:image\/(png|jpg|jpeg);base64,/, '')
    promiseArr.push(base64ThumbAsync(base64Data).then(data => (img.src = data)))
  }

  return Promise.all(promiseArr)
    .then(() => {
      // console.log(doc)
      // console.log(metaDoc)
      // if (obj.note.name) {
      //   return updateNoteUtil({
      //     ...obj,
      //     note: { ...obj.note, content: doc.documentElement.outerHTML },
      //     meta: { ...obj.meta, content: metaDoc.body.outerHTML }
      //   })
      // }
      //
      // return createNoteUtil({
      //   ...obj,
      //   note: { ...obj.note, content: doc.documentElement.outerHTML },
      //   meta: { ...obj.meta, content: metaDoc.body.outerHTML }
      // })
      const createOrUpdateNoteUtil = obj.name ? updateNoteUtil : createNoteUtil
      const newObj = obj
      delete newObj.editorState
      return createOrUpdateNoteUtil({
        ...newObj,
        noteContent: doc.documentElement.outerHTML,
        metaContent: metaDoc.body.outerHTML
      })
    })
}
