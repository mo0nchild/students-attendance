import { AliasOptions, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'
import path from 'path'

const PWAOptions: Partial<VitePWAOptions> = { 
	includeAssets: ["assets/*"],
	manifest: {
        name: 'Проверка посещений студентов',
        short_name: 'Песещения',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: 'icon192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
	},
	workbox: {
		globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
	}
} 

const pathAlias: AliasOptions = [
  	{
		find: "@components",
		replacement: path.resolve(__dirname, "src/components"),
	},
	{
		find: "@pages",
		replacement: path.resolve(__dirname, "src/pages"),
	},
	{
		find: "@services",
		replacement: path.resolve(__dirname, "src/services"),
	},
	{
		find: "@core",
		replacement: path.resolve(__dirname, "src"),
	},
	{
		find: "@styles",
		replacement: path.resolve(__dirname, "src/styles"),
	},
	{
		find: '@utils',
		replacement: path.resolve(__dirname, 'src/utils')
	},
	{
		find: '@models',
		replacement: path.resolve(__dirname, 'src/models')
	},
	{
		find: '@hooks',
		replacement: path.resolve(__dirname, 'src/hooks')
	}
]

export default defineConfig({
	plugins: [
		react(),
		VitePWA(PWAOptions)
	],
	resolve: {
		alias: pathAlias
	},
})
