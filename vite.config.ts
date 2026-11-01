import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { birthdayContent } from './src/content/birthday.ts';
import { renderPage } from './src/render.ts';

// Render actual HTML at build time: all words survive JavaScript/audio failure.
export default defineConfig({
  base: './',
  plugins: [react(), {
    name: 'birthday-static-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html) { return html.replace('<!--birthday-app-->', renderPage(birthdayContent, './')); },
    },
  }],
});