import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // Popup e Options são páginas HTML com React — tratadas normalmente
        popup: resolve(__dirname, 'src/popup/index.html'),
        options: resolve(__dirname, 'src/options/index.html'),
        // O background é um script puro — não tem HTML associado
        background: resolve(__dirname, 'src/background/index.ts'),
      },
      output: {
        // Nomes de arquivo previsíveis são obrigatórios em extensões Chrome —
        // o manifest.json referencia caminhos fixos, não hashes gerados automaticamente
        entryFileNames: '[name]/index.js',
        chunkFileNames: '[name]/[name].js',
        assetFileNames: '[name]/[name].[ext]',
      },
    },
    // esbuild já vem no Vite e não usa eval — compatível com o CSP do Manifest V3
    minify: 'esbuild',
    // Source maps desabilitados em produção conforme checklist de segurança do SPEC
    sourcemap: false,
  },
})