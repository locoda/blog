import presetAttributify from '@unocss/preset-attributify'
import transformerDirectives from '@unocss/transformer-directives'
import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWind4,
  transformerVariantGroup,
} from 'unocss'
import { themeConfig } from './src/.config'

const { colorsDark, colorsLight, fonts } = themeConfig.appearance

function makeThemeVars(colors, shadow) {
  return {
    '--color-primary': colors.primary,
    '--color-background': colors.background,
    '--color-shadow': shadow,
  }
}

const cssExtend = {
  'code::before,code::after': {
    content: 'none',
  },

  ':where(:not(pre):not(a) > code)': {
    'white-space': 'normal',
    'overflow-wrap': 'anywhere',
    'padding': '0.125rem 0.25rem',
    'color': '#c7254e',
    'font-size': '0.9em',
    'background-color': '#f9f2f4',
    'border-radius': '0.25rem',
  },

  '.dark :where(:not(pre):not(a) > code)': {
    'color': '#fda4af',
    'background-color': 'rgb(255 255 255 / 0.08)',
  },

  'li': {
    'white-space': 'normal',
    'overflow-wrap': 'anywhere',
  },
}

export default defineConfig({
  preflights: [
    {
      getCSS: () => `:root{${Object.entries(makeThemeVars(colorsLight, '#0000000A')).map(([key, value]) => `${key}:${value}`).join(';')}}.dark{${Object.entries(makeThemeVars(colorsDark, '#FFFFFF0A')).map(([key, value]) => `${key}:${value}`).join(';')}}`,
    },
  ],
  rules: [
    [
      /^row-(\d+)-(\d)$/,
      ([, start, end]) => ({ 'grid-row': `${start}/${end}` }),
    ],
    [
      /^col-(\d+)-(\d)$/,
      ([, start, end]) => ({ 'grid-column': `${start}/${end}` }),
    ],
    [
      /^scrollbar-hide$/,
      () => `.scrollbar-hide { scrollbar-width:none;-ms-overflow-style: none; }
      .scrollbar-hide::-webkit-scrollbar {display:none;}`,
    ],
  ],
  presets: [
    presetWind4(),
    presetTypography({ cssExtend }),
    presetAttributify(),
    presetIcons({ scale: 1.2, warn: true }),
  ],
  theme: {
    colors: {
      primary: 'var(--color-primary)',
      background: 'var(--color-background)',
      shadow: 'var(--color-shadow)',
    },
    fontFamily: fonts,
  },
  shortcuts: [
    ['post-title', 'text-5 font-bold lh-7.5 m-0'],
    ['post-prose', 'prose max-w-none'],
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: [
    ...themeConfig.site.socialLinks.map(social => `i-mdi-${social.name}`),
    'i-mdi-content-copy',
    'i-mdi-check',
  ],
})
