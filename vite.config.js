import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Import the plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), // <-- Add the plugin
  tailwindcss(), sentryVitePlugin({
    org: "neve-yq",
    project: "vrsa"
  })],

  build: {
    sourcemap: true
  }
})