const path = require('path');

module.exports = {
  layoutDir: 'layouts',
  plugins: [
    '@yuepress/google-analytics',
    ['@vuepress/register-components', {
      componentsDir: [
        path.resolve(__dirname, 'components')
      ]
    }],
    ['@yubisaki/blog', {
      pageEnhancers: [
        {
          when: ({ frontmatter }) => frontmatter.layout === 'Activity',
          frontmatter: { layout: 'Activity' }
        }
      ]
    }],
    '@yubisaki/pagination'
  ]
}