import { defineConfig } from 'vitepress'

const currentYear = new Date().getFullYear()

export default defineConfig({
  title: 'dumpkit',
  description: 'Zero-dependency debugging for Node.js',
  base: '/dumpkit/',

  head: [
    ['link', { rel: 'icon', href: '/dumpkit/favicon.svg', type: 'image/svg+xml' }],
  ],

  locales: {
    pt: {
      label: 'Português',
      lang: 'pt-PT',
      title: 'dumpkit',
      description: 'Debugging sem dependências para Node.js',
      themeConfig: {
        nav: [
          { text: 'Guia', link: '/pt/guide/philosophy' },
          { text: 'API', link: '/pt/api/dump' },
          { text: 'Exemplos', link: '/pt/guide/examples' },
          { text: 'Changelog', link: '/pt/changelog' }
        ],
        sidebar: {
          '/pt/': [
            {
              text: 'Guia',
              items: [
                { text: 'Início', link: '/pt/' },
                { text: 'Filosofia', link: '/pt/guide/philosophy' },
                { text: 'Começar', link: '/pt/getting-started' },
                { text: 'Exemplos', link: '/pt/guide/examples' },
                { text: 'Combinações', link: '/pt/guide/combinations' }
              ]
            },
            {
              text: 'API Reference',
              items: [
                { text: 'dump() & dd()', link: '/pt/api/dump' },
                { text: 'dp() & dpp()', link: '/pt/api/pause' },
                { text: 'inspect()', link: '/pt/api/inspect' },
                { text: 'trace()', link: '/pt/api/trace' },
                { text: 'measure()', link: '/pt/api/measure' },
                { text: 'Utils', link: '/pt/api/utils' },
                { text: 'Types', link: '/pt/api/types' }
              ]
            },
            {
              text: 'Informações',
              items: [
                { text: 'Versões', link: '/pt/changelog' },
                { text: 'Contribuir', link: '/pt/contributing' }
              ]
            }
          ]
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'dumpkit',
      description: 'Zero-dependency debugging for Node.js',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/guide/philosophy' },
          { text: 'API', link: '/en/api/dump' },
          { text: 'Examples', link: '/en/guide/examples' },
          { text: 'Changelog', link: '/en/changelog' }
        ],
        sidebar: {
          '/en/': [
            {
              text: 'Guide',
              items: [
                { text: 'Home', link: '/en/' },
                { text: 'Philosophy', link: '/en/guide/philosophy' },
                { text: 'Getting Started', link: '/en/getting-started' },
                { text: 'Examples', link: '/en/guide/examples' },
                { text: 'Combinations', link: '/en/guide/combinations' },
              ]
            },
            {
              text: 'API Reference',
              items: [
                { text: 'dump() & dd()', link: '/en/api/dump' },
                { text: 'dp() & dpp()', link: '/pt/api/pause' },
                { text: 'inspect()', link: '/en/api/inspect' },
                { text: 'trace()', link: '/en/api/trace' },
                { text: 'measure()', link: '/en/api/measure' },
                { text: 'Utils', link: '/en/api/utils' },
                { text: 'Types', link: '/en/api/types' }
              ]
            },
            {
              text: 'More',
              items: [
                { text: 'Versions', link: '/en/changelog' },
                { text: 'Contributing', link: '/en/contributing' }
              ]
            }
          ]
        }
      }
    }
  },

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/justino-code/dumpkit' }
    ],
    footer: {
      message: 'MIT License',
      copyright: `Copyright © ${currentYear} Justino Contingo`
    },
    search: {
      provider: 'local'
    }
  }
})