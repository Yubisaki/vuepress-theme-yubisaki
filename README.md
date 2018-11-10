[![npm](https://img.shields.io/badge/npm-v3.0.3-green.svg?style=popout-square)](https://www.npmjs.com/package/vuepress-theme-yubisaki)
[![npm](https://img.shields.io/badge/npm-next-green.svg?style=popout-square)](https://www.npmjs.com/package/vuepress-theme-yubisaki)

# vuepress-theme-yubisaki@next [en]

[中文说明](https://wuwaki.me/yubisaki/intro.html)

## Installation

```bash
yarn add vuepress-theme-yubisaki@next -S
```
or with npm
```bash
npm install vuepress-theme-yubisaki@next --save-dev
```

## screenshots

<div>
  <img src="https://blog-1252181333.cossh.myqcloud.com/blog/110956.png" style="display:inline" width="400" />
  <img src="https://blog-1252181333.cossh.myqcloud.com/blog/110610.png" style="display:inline" width="400" />
</div>
<div>
  <img src="https://blog-1252181333.cossh.myqcloud.com/blog/110735.png" width="200" height="360" style="display:inline"/>
  <img src="https://blog-1252181333.cossh.myqcloud.com/blog/115756.png" width="200" height="360" style="display:inline"/>
</div>
<div>
  <img src="https://blog-1252181333.cossh.myqcloud.com/blog/110901.png" width="200" height="360" style="display:inline"/>
  <img src="https://blog-1252181333.cossh.myqcloud.com/blog/115523.png" width="200" height="360" style="display:inline"/>
</div>

## Article

**Render an overview of the article**
To generate a preview of the post on the cards, use excerpt by adding `<!-- more -->` after the first paragraph or first few introductory lines in your post.

```
## What is Vue.js -
In this post I will talk about Vue.js
<!-- more -->
Vue.js is awesome
```

As in the above form, adding the `<!-- more -->` tag to the `md` file, will render the content before this tag into the articles list as their preview.


## Articles meta-data
Use [yubisaki shell](https://github.com/Bloss/yubisaki-shell) to generate a new post with automatic date-time stamp, title and metadata etc. this helps the cards to sort according to date automatically, also filter the posts by tags etc.

install shell with
```bash
yarn global add yubisaki-shell
```
and then from your project's root dir, run
```bash
yubisaki post -p <post-name> --page README.md
```
like if your post is named javascript, just run
```bash
yubisaki post -p javascript --page README.md
```

this will create a folder called javascript and a `README.md` file in it with required data automatically. You can then make changes to this file like changing the title and metadata, tags etc.

```yaml
title: Article title
# date is used for article sorting
date: 2017-08-15 10:27:26
type: post # post which type is post will be include in post list
tag: # Article tag, can be a String or an Array
  - js
  - react
# Meta tags that can be used to crawl by search engines
meta:
  - name: description
    content: Some description about your post
  - name: keywords # keywords Tags, will be queried when searching within pages
    content: theme vuepress
```
To let the theme filter by tags, add the following information alongside your previous themeConfig in `config.js` inside `.vuepress` folder

## tags

```js
module.exports = {
  themeConfig: {
    nav: [
      { text: 'TAGS', link: '/tag/' }
    ]
  }
}
```

<img src="https://blog-1252181333.cossh.myqcloud.com/blog/180137.png" width="400" />
<img src="https://blog-1252181333.cossh.myqcloud.com/blog/180218.png" width="400" />

## plugins

**Here are some plugins which the theme used**

[plugin introduction](https://vuepress.vuejs.org/plugin/#using-a-plugin)

- [@vuepress/google-analytics](https://vuepress.vuejs.org/plugin/official.html#vuepress-google-analytics)
- [@vuepress/back-to-top](https://vuepress.vuejs.org/plugin/official.html#vuepress-back-to-top)
- [@vuepress/medium-zoom](https://vuepress.vuejs.org/plugin/official.html#vuepress-medium-zoom)
- [@vuepress/register-components](https://github.com/vuejs/vuepress/blob/master/packages/%40vuepress/plugin-register-components/README.md)
- [@yubisaki/vuepress-plugin-blog](https://github.com/Yubisaki/vuepress-plugin-blog)
- [@yubisaki/vuepress-plugin-pagination](https://github.com/Yubisaki/vuepress-plugin-pagination)

`@yubisaki/vuepress-plugin-blog` This blog plugin support two markdown plugings, you can use them directly:

- [markdown-it-task-lists](https://github.com/revin/markdown-it-task-lists)
- [markdown-it-imsize](https://github.com/tatsy/markdown-it-imsize)

## Comment System

Use `gitalk` for comment system, click [gitalk](https://github.com/gitalk/gitalk) for more details.

But, don't support flipMoveOptions and render instane method

## Configuration

For your reference, I have put the configuration of my blog (`.vuepress/config.js`) here:

```js
module.exports = {
  theme: 'yubisaki',
  title: 'Yubisaki',
  description: 'vuepress theme Yubisaki',
  head: [
    ['link', { rel: 'icon', href: `/favicon.ico` }]
  ],
  port: 3000,
  ga: 'xxxxx', // Google Analytics ID
  serviceWorker: true,
  evergreen: true,
  markdown: {
    anchor: { permalink: true },
    toc: { includeLevel: [1, 2] }
  },
  themeConfig: {
    github: 'bloss',
    // favicon image (logo)
    logo: '/logo/path',
    // The time format for creating an article. If not set, it will not be displayed. Optional [yyyy-MM-dd HH:mm:ss]
    footer: 'here is footer text',
    date_format: 'yyyy-MM-dd',
    // options for comment (gitalk), don't support flipMoveOptions and render instane method
    comment: {
      clientID: 'GitHub Application Client ID',
      clientSecret: 'GitHub Application Client Secret',
      repo: 'GitHub repo',
      owner: 'GitHub repo owner',
      admin: ['GitHub repo owner and collaborators, only these guys can initialize github issues'],
      perPage: 5,
      id: location.pathname,      // Ensure uniqueness and length less than 50
      distractionFreeMode: false  // Facebook-like distraction free mode
    },
    // customize the links on the navigation bar
    nav: [
      { text: 'HOME', link: '/' },
      { text: 'TAGS', link: '/tag/' },
      { text: 'GITHUB', link: 'https://github.com/bloss' },
      { text: 'about me', link: '/about/' },
    ]
  }
}
```

## Activity layout

Besides the basic `yaml` config generated by `yubisaki-shell`, you can add the following information to customize the layout as you want:

to customize the layout, add the following to the header of the `markdown` file

```yaml
heroText: Yubisaki # title
activity: true # Use a custom activity layout that will collapse the card bar on the right
hidden: true # Set whether to display in the article list
tagline: Vuepress blog theme # description
heroImage: /static/logo.png # logo
# Refer to the configuration of the official default theme for service static files
actionText: Learn about →
actionLink: /yubisaki/usage.html
# If you want to have more than one action button (in this case actionText and actionLink will be ignored):
# actions :
#    - text : Action1
#      link : /yubisaki/action1.html
#    - text : Action2
#      link : /yubisaki/action2.html
features:
  - title: what is this
    details: A vuepress-based blog theme based on the default theme provided by vuepress
  - title: What are the characteristics?
    details: Provide article list, article pagination, article details, github card, custom event page layout, etc.
  - title: TODO
    details: Tag cloud, TAG ARCHIVE, some scripts, some out of the box layout
footer: by stickmy
```

## Development, deployment

**In the docs directory (or the root of your project), be sure to put a markdown file called README.md for generating the root path, which can be an empty file**

You can use the following scripts to run the vuepress commands or you can run them directly, whichever you prefer

`package.json`:

```js
{
  "scripts": {
    "docs:dev": "vuepress dev {dirName}",
    "docs:build": "vuepress build {dirName}"
  }
}
```
If you haven't installed vuepress gloablly, these scripts will be helpful to find the vuepress binaries from `node_modules/.bin` directory and execute them on shell. to execute above scripts, run:
```bash
npm run docs:dev
```

or
```bash
npm run docs:build
```
Accordingly.

## TODO

- Tag Cloud
- Article classification
- More cards like github card
