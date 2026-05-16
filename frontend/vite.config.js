import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import unusedImports from "eslint-plugin-unused-imports";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  rules: {
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": "warn",
  }
})
