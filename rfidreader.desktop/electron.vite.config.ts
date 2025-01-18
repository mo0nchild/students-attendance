import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
          prepare: resolve(__dirname, 'src/renderer/prepare.html')
        }
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@services': resolve('src/renderer/src/services'),
        '@pages': resolve('src/renderer/src/pages'),
        '@components': resolve('src/renderer/src/components'),
        '@core': resolve('src/renderer/src'),
        '@models': resolve('src/renderer/src/models'),
        '@utils': resolve('src/renderer/src/utils'),
        '@hooks': resolve('src/renderer/src/hooks')
      }
    },
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      cors: true,
      port: 5173,
    },
  }
})
