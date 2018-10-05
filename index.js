const path = require('path');

module.exports = {
  layoutDir: 'layouts',
  plugins: [
    ['@vuepress/google-analytics'],
    ['@vuepress/back-to-top'],
    ['@vuepress/medium-zoom'],
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
    ['@yubisaki/pagination']
  ]
}