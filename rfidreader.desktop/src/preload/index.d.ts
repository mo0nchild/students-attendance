/* eslint-disable prettier/prettier */
import { ElectronAPI } from '@electron-toolkit/preload' 
import { Api } from './typings'
declare global {
    export interface Window {
        electron: ElectronAPI
        api: Api
    }
}
