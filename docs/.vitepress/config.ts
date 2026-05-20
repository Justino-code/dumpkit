import { defineConfig } from 'vitepress'

const currentYear = new Date().getFullYear()

export default defineConfig({
  title: 'nodedump',
  description: 'Zero-dependency debugging for Node.js',
  base: '/nodedump/',

  locales: {
    pt: {
      label: 'Português',
      lang: 'pt-PT',
      title: 'nodedump',
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
                { text: 'Exemplos', link: '/pt/guide/examples' }
              ]
            },
            {
              text: 'API Reference',
              items: [
                { text: 'dump() & dd()', link: '/pt/api/dump' },
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
                { text: 'Changelog', link: '/pt/changelog' },
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
      title: 'nodedump',
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
                { text: 'Examples', link: '/en/guide/examples' }
              ]
            },
            {
              text: 'API Reference',
              items: [
                { text: 'dump() & dd()', link: '/en/api/dump' },
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
                { text: 'Changelog', link: '/en/changelog' },
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
      { icon: 'github', link: 'https://github.com/justino-code/nodedump' }
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