import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 15691, // ubah ke port yang kamu mau
  },
  optimizeDeps: {
    include: ['algoliasearch']
  }
})
