import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    // Desabilita o split automático de chunks — extensão Chrome precisa
    // de arquivos previsíveis, não de hashes aleatórios
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        options: resolve(__dirname, 'src/options/index.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
      },
      output: {
        // Garante que o service worker não seja dividido em chunks
        entryFileNames: '[name]/index.js',
        chunkFileNames: '[name]/[name].js',
        assetFileNames: '[name]/[name].[ext]',
      },
    },
    // Sem source maps em produção (requisito de segurança do SPEC)
    sourcemap: false,
    // Desabilita minificação com eval — proibido pelo CSP do Manifest V3
    minify: 'terser',
  },
})