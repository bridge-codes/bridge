// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Bridge',
  tagline: 'The new API frameworcleark',
  url: 'https://bridge.codes',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'bridge-codes', // Usually your GitHub org/user name.
  projectName: 'bridge', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  clientModules: [
    require.resolve('./docusaurus.preferredTheme.js'),
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/bridge-codes/bridge/tree/main/www',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },

      },
    ],
    [
      'docusaurus-preset-shiki-twoslash',
      {
        // Not sure how reliable this path is (it's relative from the preset package)?
        // None of the light themes had good support for `diff` mode, so had to patch my own theme
        themes: ['../../../min-light-with-diff', 'nord'],
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-google-analytics',
      {
        trackingID: 'UA-141789564-1',
        anonymizeIP: true,
      },
    ],

    async function myPlugin() {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS, AutoPrefixer & CSSNano.
          /* eslint-disable @typescript-eslint/no-var-requires */
          postcssOptions.plugins.push(require('tailwindcss'));
          postcssOptions.plugins.push(require('autoprefixer'));
          if (process.env.NODE_ENV === 'production') {
            postcssOptions.plugins.push(require('cssnano'));
          }
          /* eslint-enable @typescript-eslint/no-var-requires */
          return postcssOptions;
        },
      };
    },
  ],
  themeConfig: {
    prism: {
      theme: require('prism-react-renderer/themes/nightOwl'),
    },
    disableSwitch: false,
    respectPrefersColorScheme: true,
    navbar: {
      title: 'Bridge',
      logo: {
        alt: 'Bridge Logo',
        src: 'img/logo_b.svg',
        width: 25,
        srcDark: 'img/logo_w.svg',
      },
      items: [
        {
          to: 'docs/introduction',
          label: 'Docs',
        },
        {
          to: 'docs/quickstart',
          label: 'Quickstart',
        },
        {
          to: '/studio',
          label: 'Bridge Studio',
        },
        {
          href: 'https://github.com/bridge-codes/bridge',
          position: 'right',
          className: 'header-social-link header-github-link',
          'aria-label': 'GitHub',
        },
        {
          href: 'https://twitter.com/bridge_codes',
          position: 'right',
          className: 'header-social-link header-twitter-link',
          'aria-label': 'Twitter',
        },
        {
          href: 'https://discord.gg/yxjrwm7Bfr',
          position: 'right',
          className: 'header-social-link header-discord-link',
          'aria-label': 'Discord',
        },

      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/handler',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/yxjrwm7Bfr',
              className: 'flex items-center',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/bridge_codes',
              className: 'flex items-center',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
              className: 'flex items-center',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/bridge-codes/bridge',
              className: 'flex items-center',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Bridge`,
    },

    metadata: [
      { content: "https://bridge.codes/twitter.png", name: "twitter:image" },
      { content: "https://bridge.codes/twitter.png", property: "og:image" },
      { content: "The Typescript API framework that enhances developer productivity", name: "description" },
      { content: "The Typescript API framework that enhances developer productivity", property: "og:description" },
      { content: "max-snippet:-1, max-image-preview:large, max-video-preview:-1", name: "robots" },
      { content: "width=device-width, initial-scale=1.0", name: "viewport" },
      { content: "@vercel", name: "twitter:site" },
      { content: "Bridge", name: "apple-mobile-web-app-title" },
      { content: "var(--geist-background)", name: "theme-color" },
      { content: "#000000", name: "msapplication-TileColor" },
    ],

  },


};

module.exports = config;
