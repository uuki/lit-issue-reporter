import type { UserConfig, ConfigEnv } from 'vite'
import { resolve } from 'path'
import { loadEnv } from 'vite'
import svgLoader from 'vite-svg-loader'
import { Plugin } from 'postcss'
import postcssLit from 'rollup-plugin-postcss-lit'
import nested from 'postcss-nested'
import autoprefixer from 'autoprefixer'
import graphql from '@rollup/plugin-graphql'
import ImportMetaEnvPlugin from '@import-meta-env/unplugin'

export default ({ mode }: ConfigEnv): UserConfig => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return {
    build: {
      target: 'es2015',
      outDir: 'dist',
      lib: {
        entry: resolve(__dirname, 'src', 'index.ts'),
        formats: ['es'],
        fileName: (format) => `index.${format}.js`,
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    plugins: [
      ImportMetaEnvPlugin.vite({
        env: '.env',
        example: '.env.example',
      }),
      svgLoader({
        svgo: false,
      }),
      graphql(),
      postcssLit(),
    ],
    css: {
      postcss: {
        plugins: [autoprefixer(), nested as unknown as Plugin],
      },
    },
  }
}
