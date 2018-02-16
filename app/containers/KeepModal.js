import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Dialog from 'material-ui/Dialog'
import Dropzone from 'react-dropzone'
import FlatButton from 'material-ui/FlatButton'
// import Moment from 'moment'
import * as Jimp from 'jimp'
import { keepModalOpenSelector } from '../selectors'
import { toggleKeepModal } from '../actions/app'
import { importGoogleKeepNotes } from '../actions/files/notes'

const mapStateToProps = state => ({
  keepModalOpen: keepModalOpenSelector(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleKeepModal,
  importGoogleKeepNotes
}, dispatch)

class KeepModal extends Component {
  // constructor(props) {
  //   super(props)
  // }

  processFiles(fileArray) {
    console.log(`processFiles() fileArray.length === ${fileArray.length}`)
    const metaArray = []
    const attachmentMetaArray = []
    const attachmentArray = []
    const pathsArray = []

    const base64ThumbAsync = base64Data => new Promise((resolve, reject) => {
      Jimp.read(Buffer.from(base64Data, 'base64'))
      .then(image => (
        image.resize(240, Jimp.AUTO)
        .getBase64(Jimp.AUTO, (err, thumbnail) => {
          if (err) return reject(err)
          resolve(thumbnail)
        })
      ))
    })

    const readFile = file => new Promise((resolve, reject) => {
      pathsArray.push({
        name: file.name,
        path: file.path
      })

      const parser = new DOMParser()
      const doc = parser.parseFromString(file.innerHtml, 'text/html')
      const meta = {}

      meta.name = `.${file.name}.json`

      const title = doc.getElementsByClassName('title')[0]
      if (title) {
        meta.title = title.innerText
      }
      const contentNode = doc.getElementsByClassName('content')[0]
      if (contentNode) {
        meta.content = contentNode.innerHTML
      }

      const color = doc.getElementsByClassName('note')[0].className.split(' ')[1]
      if (color) {
        meta.color = color
      } else {
        meta.color = 'DEFAULT'
      }
      // const heading = doc.getElementsByClassName('heading')[0].innerText.trim()
      const archived = doc.getElementsByClassName('archived')[0]
      if (archived) {
        meta.state = 'ARCHIVED'
      } else {
        meta.state = 'INBOX'
      }

      if (doc.getElementsByClassName('label').length) {
        meta.labels = Array.from(doc.getElementsByClassName('label')).map(label => label.innerText)
      }

      const findNextName = (name, type, array, i = 0) => {
        if (array.includes(`${name}.${type}`)) {
          return findNextName(`${name} (${i + 1})`, array, (i + 1))
        }
        return `${name}.${type}`
      }

      const attachments = doc.getElementsByClassName('attachments')[0]
      if (attachments) {
        meta.attachments = []
        const liArray = attachments.children[0].children
        for (let i = 0; i < liArray.length; i += 1) {
          const attachment = liArray[i].children[0]
          let type
          let base64Data

          if (attachment.tagName === 'A') {
            type = attachment.href.match(/data:(.*);base64,/)[1] || 'application/octet-stream'
            base64Data = attachment.href.replace(/^data:audio\/3gpp;base64,/, '')

            attachmentMetaArray.push({
              name: `.${file.name.slice(0, -5)}.${type.replace(/^(.*)\//, '')}.json`,
              isAttachment: true,
              type
            })
          }

          if (attachment.tagName === 'IMG') {
            type = attachment.src.match(/data:(.*);base64,/)[1] || 'application/octet-stream'
            base64Data = attachment.src.replace(/^data:image\/(png|jpg|jpeg);base64,/, '')

            base64ThumbAsync(base64Data)
              .then(thumbnail => (
                attachmentMetaArray.push({
                  name: `.${file.name.slice(0, -5)}.${type.replace(/^(.*)\//, '')}.json`,
                  isAttachment: true,
                  type,
                  thumbnail
                })
              ))
              .catch(err => reject(err))
          }

          const name = findNextName(
            `${file.name.slice(0, -5)}`,
            `${type.replace(/^(.*)\//, '')}`,
            meta.attachments
          )

          meta.attachments.push(name)

          attachmentArray.push({
            name: `${file.name.slice(0, -5)}.${type.replace(/^(.*)\//, '')}`,
            type,
            base64Data
          })
        }
      }

      resolve(metaArray.push(meta))
    })

    Promise.all(fileArray.map(file => readFile(file)))
      .then(() => {
        console.log(`pathsArray.length: ${pathsArray.length}`)
        console.log(`fileArray.length: ${fileArray.length}`)
        return this.props.importGoogleKeepNotes(
          pathsArray, metaArray, attachmentArray, attachmentMetaArray
        )
      })
      .catch(err => console.log(err))
  }

  uploadKeepAttachments() {
    console.log('uploadKeepAttachments()')
  }

  createUploadsFolder() {
    console.log('createUploadsFolder()')
  }

  onDrop(acceptedFiles, rejectedFiles) {
    const readFile = file => new Promise(resolve => {
      const reader = new FileReader()

      reader.onload = () => {
        resolve({
          innerHtml: reader.result,
          // TODO: find out why spread operator isn't working here
          // ...file
          lastModified: file.lastModified,
          lastModifiedDate: file.lastModifiedDate,
          name: file.name,
          path: file.path,
          preview: file.preview,
          size: file.size,
          type: file.type,
        })
      }

      reader.readAsText(file)
    })

    Promise.all(acceptedFiles.map(acceptedFile => readFile(acceptedFile)))
    .then(fileArray => this.processFiles(fileArray))
    .catch(err => console.log(err))
  }

  render() {
    const keepModalActions = [
      <FlatButton
        label="Close"
        style={{ color: '#202020' }}
        onTouchTap={this.props.toggleKeepModal}
      />
    ]

    return (
      <Dialog
        title="Upload Google Keep Notes"
        actions={keepModalActions}
        modal={false}
        open={this.props.keepModalOpen}
        onRequestClose={this.props.toggleKeepModal}
      >
        <Dropzone
          accept="text/html"
          onDrop={this.onDrop.bind(this)}
          style={{
            borderStyle: 'solid',
            height: '200px',
            borderWidth: '2px',
            borderColor: 'rgb(102, 102, 102)',
            borderRadius: '5px'
          }}
        >
          <p style={{ textAlign: 'center', position: 'relative', top: '48%' }}>
            Try dropping some exported Google Keep notes here,
            or click to select which html files to upload.
          </p>
        </Dropzone>
        <div style={{ marginTop: '10px' }}>
          <a
            style={{ textDecoration: 'underline' }}
            href="https://takeout.google.com/settings/takeout"
          >
            Click here
          </a>
          {' '}
          to download your Google Keep notes. Click &apos;Select none&apos;,
          then check &apos;Keep&apos;, hit &apos;Next&apos;, then click &apos;Create archive&apos;.
          When it&apos;s done, extract the zip, go into the folder called &apos;Keep&apos;,
          and select as many notes as you wish to upload. Then drag them here!
        </div>
      </Dialog>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeepModal)
