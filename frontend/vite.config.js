import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
	],
	build: {
		outDir: path.resolve(__dirname, '../view'),
		emptyOutDir: true
	},
	server: {
		host: true, // shorthand for 0.0.0.0
		allowedHosts: ['frontend'],
	},

})
