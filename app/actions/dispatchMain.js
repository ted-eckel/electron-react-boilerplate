import { ipcRenderer } from 'electron'

export default action => (
  ipcRenderer.send('dispatch', action)
)
