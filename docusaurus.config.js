// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'DevOps with Docker',
  tagline: 'Containers for Beginners',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://devopswithdocker.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'docker-hy', // Usually your GitHub org/user name.
  projectName: 'devopswithdocker', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/docker-hy/docker-hy.github.io/blob/master/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/logo.jpg',
      navbar: {
        title: 'DevOps with Docker',
        logo: {
          alt: 'My Site Logo',
          src: 'img/favicon.ico',
        },
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Help',
            items: [
              {
                label: 'Discord',
                href: 'https://study.cs.helsinki.fi/discord/join/docker',
              },
              {
                label: 'Report an issue',
                to: 'https://github.com/docker-hy/docker-hy.github.io/issues/new',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'About',
                to: '/credits',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/docker-hy/docker-hy.github.io',
              },
            ],
          },
          {
            title: 'In collaboration',
            items: [
              {
                label: 'University of Helsinki',
                href: 'https://helsinki.fi',
              },
              {
                label: 'Eficode',
                href: 'https://eficode.com',
              },
              {
                label: 'Unity',
                href: 'https://unity.com',
              }
            ],
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),

  plugins: [require.resolve('docusaurus-lunr-search')],
};

module.exports = config;
