import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import postcssNesting from 'postcss-nesting';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';
import { getMiCss } from './utils/get-css.mjs';
import { config as pkgConfig } from './package.json';

// import fs from 'fs';

// https://vitejs.dev/config/
export default async ({ command }) => {
  let miCss;
  if (command === 'build') {
    // weird workaround to get the embed file to be the main output with proper paths
    // fs.copyFileSync(resolve(__dirname, 'templates/embed.html'), 'embed.html');
    // fs.copyFileSync(resolve(__dirname, 'templates/simple-table.html'), 'simple-table.html');
  } else {
    miCss = await getMiCss();
  }
  return defineConfig({
    plugins: [
      svelte(),
      handlebars({
        partialDirectory: resolve(__dirname, 'partials'),
        context: {
          title: pkgConfig.projectName + '-dev',
          miCss: miCss
        },
      }),
    ],
    css: {
      postcss: {
        plugins: [postcssNesting],
      },
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          assetFileNames: "assets/[name][extname]",
          chunkFileNames: "assets/[name].js",
          entryFileNames: "assets/[name].js"
        },
        input: {
          embed: resolve(__dirname, 'partials/embed.html')
        },
      },
    },
  });
};
