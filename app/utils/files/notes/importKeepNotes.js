export default (
  pathsArray,
  metaArray,
  attachmentArray,
  attachmentMetaArray,
  defaultNotesDir
) => {
  console.log(defaultNotesDir)
  // console.log(`attachmentMetaArray.length: ${attachmentMetaArray.length}`)
  // attachmentMetaArray.forEach(attachmentMeta => {
  //   console.log(attachmentMeta.type)
  //   if (attachmentMeta.type === 'image/jpeg') {
  //     console.log("attachmentMeta.type === 'image/jpeg'")
  //     writeFileAsync(
  //       `${defaultNotesDir}${attachmentMeta.name}.jpeg`,
  //       Buffer.from(attachmentMeta.thumbnail.replace(
  //         /^data:image\/(png|jpg|jpeg);base64,/, ''
  //       ), 'base64')
  //     )
  //   }
  // })
}
