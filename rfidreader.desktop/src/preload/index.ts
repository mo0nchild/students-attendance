/* eslint-disable @typescript-eslint/triple-slash-reference */

import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Api } from './typings'

const api: Api = {
  getFileData: async (info) => {
    return await ipcRenderer.invoke('getFileData', info)
  },
  openFileDialog: async () => {
    return await ipcRenderer.invoke('openFileDialog')
  }
}
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
