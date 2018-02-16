export default data => {
  global.mainWindow.webContents.send('dispatch', data)
}
