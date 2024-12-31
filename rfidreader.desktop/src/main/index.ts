/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { app, shell, BrowserWindow, Tray, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { ChildProcess, execSync, spawn } from 'child_process'

import icon from '../../resources/icon512.png?asset'

const javaPath = String.raw`C:\Users\letsp\.jdks\openjdk-23\bin\java.exe`
const serverPort = 8443
const serverHealthCheckUrl = 'http://127.0.0.1:8443/healthcheck' 
let serverIsStarted: boolean = false
let serverProcess: ChildProcess | null = null

let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

function createAppWindow(): BrowserWindow {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    ...{ icon },
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
    }
  })
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}`)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  mainWindow.on('close', (event) => {
    if (mainWindow) {
      event.preventDefault()
      mainWindow.hide()
    }
  })
  mainWindow.on('closed', () => {
    mainWindow = null
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
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
    }
  })
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    prepareWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/prepare.html`)
  } else {
    prepareWindow.loadFile(join(__dirname, '../renderer/prepare.html'))
  }
  prepareWindow.on('close', () => app.quit())
  return prepareWindow
}

function createTray() {
  tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', click: () => app.quit() }
  ])
  tray.addListener('click', () => {
    if (serverIsStarted) mainWindow?.show()
  })
  tray.setToolTip('Посещения')
  tray.setContextMenu(contextMenu)
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  createAppWindow()
  createTray()
  let prepareWindow = createPrepareWindow() as BrowserWindow | null
  prepareWindow!.on('show', function() {
    serverProcess = spawn(javaPath, ['-jar', `-Dspring.config.location=${join(__dirname, './../../resources/application.properties')}`, 
      join(__dirname, './../../resources/rfidreader-backend.jar'), ])

    serverProcess.stdout?.on('data', data => console.log(`INFO: ${data}`))
    serverProcess.on('error', error => console.log(error))
    serverProcess.on('exit', code => {
      console.log(`EXIT: with code ${code}`)
      app.quit()
    })

    const checkServer = setInterval(async () => {
      try {
        const response = await fetch(serverHealthCheckUrl)
        if(response.status == 200) {
          serverIsStarted = true
          clearInterval(checkServer)
          mainWindow?.show()
          mainWindow?.reload()
          prepareWindow?.hide()
          prepareWindow = null
        }
      }
      catch {}
    }, 1000)
  })
  prepareWindow!.on('ready-to-show', () => prepareWindow!.show())
})
app.on('before-quit', () => {
  stopServerProcess()
  process.exit()
})
app.on('window-all-closed', () => {})

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
