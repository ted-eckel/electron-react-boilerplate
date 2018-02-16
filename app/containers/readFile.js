// processFiles(fileArray) {
//   const metaArray = []
//   const attachmentMetaArray = []
//   const attachmentArray = []
//   const pathsArray = []
//
//   const base64ThumbAsync = base64Data => new Promise((resolve, reject) => {
//     Jimp.read(Buffer.from(base64Data, 'base64'))
//     .then(image => (
//       image.resize(240, Jimp.AUTO)
//       .getBase64(Jimp.AUTO, (err, thumbnail) => {
//         if (err) return reject(err)
//         resolve(thumbnail)
//       })
//     ))
//   })
//
//   const readFile = file => new Promise((resolve, reject) => {
//     pathsArray.push({
//       name: file.name,
//       path: file.path
//     })
//
//     const parser = new DOMParser()
//     const doc = parser.parseFromString(file.innerHtml, 'text/html')
//     const meta = {}
//
//     meta.name = `.${file.name}.json`
//
//     const title = doc.getElementsByClassName('title')[0]
//     if (title) {
//       meta.title = title.innerText
//     }
//     const contentNode = doc.getElementsByClassName('content')[0]
//     if (contentNode) {
//       meta.content = contentNode.innerHTML
//     }
//
//     const color = doc.getElementsByClassName('note')[0].className.split(' ')[1]
//     if (color) {
//       meta.color = color
//     } else {
//       meta.color = 'DEFAULT'
//     }
//     // const heading = doc.getElementsByClassName('heading')[0].innerText.trim()
//     const archived = doc.getElementsByClassName('archived')[0]
//     if (archived) {
//       meta.state = 'ARCHIVED'
//     } else {
//       meta.state = 'INBOX'
//     }
//
//     if (doc.getElementsByClassName('label').length) {
//       meta.labels = Array.from(doc.getElementsByClassName('label')).map(label => label.innerText)
//     }
//
//     const attachments = doc.getElementsByClassName('attachments')[0]
//     if (attachments) {
//       meta.attachments = []
//       const liArray = attachments.children[0].children
//       for (let i = 0; i < liArray.length; i += 1) {
//         const attachment = liArray[i].children[0]
//         let type
//         let base64Data
//
//         if (attachment.tagName === 'A') {
//           type = attachment.href.match(/data:(.*);base64,/)[1] || 'application/octet-stream'
//           base64Data = attachment.href.replace(/^data:audio\/3gpp;base64,/, '')
//
//           attachmentMetaArray.push({
//             name: `.${file.name.slice(0, -5)}.${type.replace(/^(.*)\//, '')}.json`,
//             isAttachment: true,
//             type
//           })
//         }
//
//         if (attachment.tagName === 'IMG') {
//           type = attachment.src.match(/data:(.*);base64,/)[1] || 'application/octet-stream'
//           base64Data = attachment.src.replace(/^data:image\/(png|jpg|jpeg);base64,/, '')
//
//           base64ThumbAsync(base64Data)
//           .then(thumbnail => (
//             attachmentMetaArray.push({
//               name: `.${file.name.slice(0, -5)}.${type.replace(/^(.*)\//, '')}.json`,
//               isAttachment: true,
//               type,
//               thumbnail
//             })
//           ))
//           .catch(err => reject(err))
//         }
//
//         meta.attachments.push(name)
//
//         attachmentArray.push({
//           name: `${file.name.slice(0, -5)}.${type.replace(/^(.*)\//, '')}`,
//           type,
//           base64Data
//         })
//
//         // const extension = type === 'image/jpeg' ? 'jpg' : type.replace(/^(.*)\//, '')
//       }
//     }
//
//     resolve(metaArray.push(meta))
//   })
//
//   Promise.all(fileArray.map(file => readFile(file)))
//   .then()
// }

// processFiles(fileArray) {
//   const metaArray = []
//   const attachmentMetaArray = []
//   const attachmentArray = []
//   const pathsArray = []
//
//   fileArray.forEach((file, idx) => {
//     pathsArray.push({
//       name: file.name,
//       path: file.path
//     })
//
//     const parser = new DOMParser()
//     const doc = parser.parseFromString(file.innerHtml, 'text/html')
//     const meta = {}
//
//     meta.name = `.${file.name}.json`
//
//     const title = doc.getElementsByClassName('title')[0]
//     if (title) {
//       meta.title = title.innerText
//     }
//     const contentNode = doc.getElementsByClassName('content')[0]
//     if (contentNode) {
//       meta.content = contentNode.innerHTML
//     }
//
//     const color = doc.getElementsByClassName('note')[0].className.split(' ')[1]
//     if (color) {
//       meta.color = color
//     } else {
//       meta.color = 'DEFAULT'
//     }
//     // const heading = doc.getElementsByClassName('heading')[0].innerText.trim()
//     const archived = doc.getElementsByClassName('archived')[0]
//     if (archived) {
//       meta.state = 'ARCHIVED'
//     } else {
//       meta.state = 'INBOX'
//     }
//
//     if (doc.getElementsByClassName('label').length) {
//       meta.labels = Array.from(doc.getElementsByClassName('label')).map(label => label.innerText)
//     }
//
//     const attachments = doc.getElementsByClassName('attachments')[0]
//     if (attachments) {
//       meta.attachments = []
//       const liArray = attachments.children[0].children
//       for (let i = 0; i < liArray.length; i += 1) {
//         const attachment = liArray[i].children[0]
//         let type
//         let base64Data
//
//         if (attachment.tagName === 'A') {
//           type = attachment.href.match(/data:(.*);base64,/)[1] || 'application/octet-stream'
//           base64Data = attachment.href.replace(/^data:audio\/3gpp;base64,/, '')
//
//           attachmentMetaArray.push({
//             name: `.${file.name.slice(0, -5)}.${type.replace(/^(.*)\//, '')}.json`,
//             isAttachment: true,
//             type
//           })
//         }
//
//         if (attachment.tagName === 'IMG') {
//           type = attachment.src.match(/data:(.*);base64,/)[1] || 'application/octet-stream'
//           base64Data = attachment.src.replace(/^data:image\/(png|jpg|jpeg);base64,/, '')
//
//           const base64ThumbAsync = () => new Promise((resolve, reject) => {
//             Jimp.read(Buffer.from(base64Data, 'base64'))
//             .then(image => (
//               image.resize(240, Jimp.AUTO)
//               .getBase64(type, (err, thumbnail) => {
//                 if (err) return reject(err)
//                 resolve(thumbnail)
//               })
//             ))
//           })
//
//           base64ThumbAsync()
//           .then(thumbnail => {
//             attachmentMetaArray.push({
//               name: `.${file.name.slice(0, -5)}.${type.replace(/^(.*)\//, '')}.json`,
//               isAttachment: true,
//               type,
//               thumbnail
//             })
//           })
//           .catch(err => console.log(err))
//         }
//
//         meta.attachments.push(name)
//
//         attachmentArray.push({
//           name: `${file.name.slice(0, -5)}.${type.replace(/^(.*)\//, '')}`,
//           type,
//           base64Data
//         })
//
//         // const extension = type === 'image/jpeg' ? 'jpg' : type.replace(/^(.*)\//, '')
//       }
//     }
//
//     metaArray.push(meta)
//
//     if (idx === fileArray.length - 1) {
//       console.log(`idx: ${idx}`)
//       console.log(`fileArray.length: ${fileArray.length}`)
//
//       this.props.importGoogleKeepNotes(
//         pathsArray, metaArray, attachmentArray, attachmentMetaArray
//       )
//     }
//   })
// }
