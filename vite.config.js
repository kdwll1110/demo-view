import {
	defineConfig
} from 'vite'
import vue from '@vitejs/plugin-vue'
import {
	resolve
} from 'path'
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		port: 9527,
		open: true
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, "src")
		}
	}
})
