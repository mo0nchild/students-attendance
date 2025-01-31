/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { app, shell, BrowserWindow, Tray, Menu, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { readFile, readFileSync } from 'fs'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { ChildProcess, execSync, spawn } from 'child_process'
import icon from '../../resources/icon512.png?asset'

let serverIsStarted: boolean = false
let serverProcess: ChildProcess | null = null

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

const javaPath = (() => {
  if (!process.env.JAVA_HOME) throw new Error('JAVA_HOME environment variable not install')
  return join(process.env.JAVA_HOME, 'bin', 'java.exe')
})()
const serverPort = (() => {
  const propertiesPath = app.isPackaged
    ? join(process.cwd(), './resources/app.asar.unpacked/resources/application.properties')
    : join(__dirname, './../../resources/application.properties')
  const portRegex = readFileSync(propertiesPath, { encoding: 'utf8' }).match(/port=(?<port>\d+)/) 
  if (portRegex && portRegex.groups) {
    return parseInt(portRegex.groups.port)
  }
  else throw new Error('Not found application.properties PORT property')
})()

function createAppWindow(): BrowserWindow {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    ...{ icon },
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, './../preload/index.js'),
      nodeIntegration: true
    }
  })
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}`)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: '/' })
  }
  mainWindow.on('resize', () => mainWindow?.webContents.send('resize'))
  mainWindow.on('unmaximize', () => mainWindow?.webContents.send('resize'))
  mainWindow.on('maximize', () => mainWindow?.webContents.send('resize'))
  ipcMain.on('focus-fix', () => {
    mainWindow?.blur()
    mainWindow?.focus()
  })
  mainWindow.on('close', (event) => {
    if (mainWindow) {
      event.preventDefault()
      mainWindow.hide()
    }
  })
  return mainWindow
}

function createPrepareWindow(): BrowserWindow {
  const prepareWindow = new BrowserWindow({
    width: 400,
    height: 340,
    show: false,
    resizable: false,
    fullscreenable: false,
    minimizable: false,
    autoHideMenuBar: true,
    ...{ icon },
  })
  prepareWindow.setAlwaysOnTop(true, 'screen-saver')
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    prepareWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/prepare.html`)
  } else {
    prepareWindow.loadFile(join(__dirname, '../renderer/prepare.html'))
  }
  prepareWindow.on('close', () => app.quit())
  return prepareWindow
}

function createTray(contextMenu = Menu.buildFromTemplate([ { label: 'Quit', click: () => app.quit() } ])) {
  tray = new Tray(icon)
  tray.addListener('click', () => { if (serverIsStarted) mainWindow?.show() })
    
  tray.setToolTip('Посещения')
  tray.setContextMenu(contextMenu)
}

if (!app.requestSingleInstanceLock()) app.quit()
else app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  createAppWindow()
  createTray()
  ipcMain.handle('getFileData', async (_, args: { path: string }) => {
    const fileData = await new Promise<string>((resolve, reject) => {
      readFile(args.path, { encoding: 'utf8' }, (error, data) => {
        if (error) reject(error.message)
        else resolve(data)
      })
    })
    return fileData
  })
  ipcMain.handle('openFileDialog', async () => {
    const { filePaths } = await dialog.showOpenDialog({ 
      properties: ['openFile'],
      filters: [
        { name: 'Text file', extensions: ['txt'] }
      ] 
    })
    if (filePaths.length <= 0) return undefined
    return filePaths[0]
  })
  
  let prepareWindow = createPrepareWindow() as BrowserWindow | null

  prepareWindow!.on('show', function() {
    createServerProcess()
    const serverHealthCheckUrl = `http://127.0.0.1:${serverPort}/healthcheck`
    const checkServer = setInterval(async () => {
      try {
        const response = await fetch(serverHealthCheckUrl, { method: 'GET' })
        if (response.status == 200) {
          serverIsStarted = true
          mainWindow?.show()
          mainWindow?.reload()
          
          prepareWindow?.hide()
          prepareWindow = null

          clearInterval(checkServer)
        }
      } catch {}
    }, 1000)
  })
  prepareWindow!.on('ready-to-show', () => prepareWindow!.show())
})
app.on('second-instance', () => {
  if (mainWindow && serverIsStarted) {
    mainWindow?.show()
    mainWindow?.reload()
  }
})
app.on('before-quit', () => {
  stopServerProcess()
  process.exit()
})
app.on('window-all-closed', () => {})

function createServerProcess(): ChildProcess {
  serverProcess = spawn(javaPath, ['-jar', 
    app.isPackaged
      ? `-Dspring.config.location=${join(process.cwd(), './resources/app.asar.unpacked/resources/application.properties')}`
      : `-Dspring.config.location=${join(__dirname, './../../resources/application.properties')}`, 
    !app.isPackaged
      ? join(__dirname, './../../resources/rfidreader-backend.jar')
      : join(process.cwd(), './resources/app.asar.unpacked/resources/rfidreader-backend.jar')
  ])
  serverProcess.stdout?.on('data', data => console.log(`INFO: ${data}`))
  serverProcess?.stderr?.on('data', data => console.log(`ERROR: ${data}`))
  
  serverProcess.on('error', error => console.log(error))
  serverProcess.on('exit', code => {
    console.log(`EXIT: with code ${code}`)
    app.quit()
  })
  return serverProcess
}

function stopServerProcess() {
  if (serverProcess) {
    serverProcess.kill('SIGINT')
    serverProcess = null
    serverIsStarted = false
    try {
      const netstatOutput = execSync(`netstat -ano | findstr :${serverPort}`).toString()
      const pidMatch = netstatOutput.match(/LISTENING\s+(?<pid>\d+)/)
      if (pidMatch && pidMatch.groups) {
        execSync(`taskkill /PID ${pidMatch.groups['pid']} /F`, { stdio: 'inherit' })
      }
    } catch (error) {
      console.error('Error forcefully closing the port:', error)
    }
  }
}
