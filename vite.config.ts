import type { UserConfig, ConfigEnv } from 'vite'
import type { Drop } from 'esbuild'
import { resolve } from 'path'
import { loadEnv } from 'vite'
import svgLoader from 'vite-svg-loader'
import { Plugin } from 'postcss'
import postcssLit from 'rollup-plugin-postcss-lit'
import nested from 'postcss-nested'
import classPrfx from 'postcss-class-prefix'
import autoprefixer from 'autoprefixer'
import graphql from '@rollup/plugin-graphql'
import EnvironmentPlugin from 'vite-plugin-environment'

export default ({ mode }: ConfigEnv): UserConfig => {
  const BASE_ENV = loadEnv(mode === 'development' ? '' : mode, process.cwd(), 'REPORTER_')

  return {
    root: process.cwd(),
    build: {
      target: 'es2015',
      outDir: 'dist',
      ...(mode !== 'staging' && {
        lib: {
          entry: resolve(__dirname, 'src', 'index.ts'),
          formats: ['es'],
          fileName: (format) => `index.${format}.js`,
        },
      }),
    },
    esbuild: {
      drop: [...(mode === 'production' ? (['console', 'debugger'] as Drop[]) : [])],
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    plugins: [
      EnvironmentPlugin(BASE_ENV, { defineOn: 'import.meta.env' }),
      svgLoader({
        svgo: false,
      }),
      graphql(),
      postcssLit(),
    ],
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          nested as unknown as Plugin,
          classPrfx(`${BASE_ENV.REPORTER_APP_PREFIX}-`, { ignore: [] }),
        ],
      },
    },
  }
}
