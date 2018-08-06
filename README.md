# vuepress-theme-yubisaki

## HomePage

[Yubisaki-theme](https://wuwaki.me/yubisaki/)

## USAGE

```bash
yarn add vuepress-theme-yubisaki -S
```

## Article

**渲染文章的概述**

```
## 标题一

我是第一段落
<!-- more -->
我是第二段落
```

如上面的形式, 在 `md` 文件中添加 `<!-- more -->` 标签, 那么这个标签之前的内容就会被渲染到文章列表中为文章的内容概述

在 `markdown` 文件头部加上以下内容 (已提供脚本[yubisaki-shell](https://github.com/Bloss/yubisaki-shell)生成)

```yaml
title: 文章标题
# 用于文章排序
date: 2017-08-15 10:27:26
tag: # 文章标签, 可以是 String 或者 Array
  - js
  - react
# 一些 meta 标签, 可以用于被搜索引擎爬取
meta:
  - name: description
    content: 一些描述
  - name: keywords # keywords 标签, 在页内搜索时会被查询
    content: theme vuepress
```

## tags

```js
module.exports = {
  themeConfig: {
    tags: true,
    nav: [
      { text: 'TAGS', link: '/tags/', tags: true }
    ]
  }
}
```

如上面的配置, 可以开启 `tags` 标签功能, 然后在导航栏上加入一个 `TAGS` 导航并且指定 `tags` 属性为 `true`, 表明这是一个标签导航, 这样主题可以为其开启标签的功能, 看起来是这样的:

![](https://blog-1252181333.cossh.myqcloud.com/blog/180137.png)

![](https://blog-1252181333.cossh.myqcloud.com/blog/180218.png)


## 配置

这边放上我的博客的配置文件: `.vuepress/config.js`, 以供大家参考

```js
module.exports = {
  // 启用自定义的主题
  theme: 'yubisaki',
  title: 'Yubisaki',
  description: 'vuepress theme Yubisaki',
  head: [
      ['link', { rel: 'icon', href: `/favicon.ico` }]
  ],
  port: 3000,
  // Google Analytics ID
  ga: 'xxxxx',
  // PWA support
  serviceWorker: true,
  // fuck IE
  evergreen: true,
  markdown: {
    // markdown-it-anchor 的选项
    anchor: { permalink: true },
    // markdown-it-toc 的选项
    toc: { includeLevel: [1, 2] },
    config: md => {
      md.use(require('markdown-it-task-lists')) // 一个 checkbox 的 TODO List 插件
        .use(require('markdown-it-imsize'), { autofill: true }) // 支持自定义 md 图片大小 ![](http://test.png =200x200)
    }
  },
  // 主题的一些配置
  themeConfig: {
    // 博客背景图片
    background: `/background/path`,
    tags: true,
    // github card
    github: 'github username',
    // 博客的 logo
    logo: '/logo/path',
    // 定制文章标题颜色
    accentColor: '#ac3e40',
    // 每页显示的文章数量
    per_page: 5,
    // 创建文章的时间格式, 不设则不显示 可选 [yyyy-MM-dd HH:mm:ss]
    date_format: 'yyyy-MM-dd',
    // 和 vuepress 默认主题一样, 定制导航栏上的链接
    nav: [
        { text: 'HOME', link: '/', root: true }, // 指定这是博客文章的 root 目录
        { text: 'TAGS', link: '/tags/', tags: true }, // 指定这是 tags 目录
        { text: 'GITHUB', link: 'https://github.com/bloss' },
        { text: '关于我', link: '/about/' }, 
    ]
  }
}
```


## 自定义 layout

在 `markdown` 文件头部加上以下内容

```yaml
heroText: Yubisaki # title
activity: true # 使用自定义的 activity layout, 会收起右边的卡片栏
hidden: true # 设置是否在文章列表中显示
tagline: vuepress 博客主题 # 描述
heroImage: /static/logo.png # logo
# 参考官方默认主题的配置
actionText: 了解一下 →  
actionLink: /yubisaki/usage.html # action 链接
features:
  - title: 这是什么
    details: 一个基于 vuepress 的博客主题, 它基于 vuepress 提供的默认主题
  - title: 有哪些特点
    details: 提供文章列表, 文章分页, 文章详情, github card, 自定义活动页 layout 等等功能
  - title: TODO
    details: 标签云, TAG ARCHIVE, 一些脚本, 一些 开箱即用的layout
footer: by stickmy
```

## 开发, 部署

**在 docs 目录下, 务必放一个 markdown 文件, 用于生成根路径路由, 它可以是一个空文件**

`project/package.json`:

```js
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

利用 `npm script` 去开发, 运行. 它会将 `node_modules/.bin` 加入到 `node shell` 的 `PATH` 变量中, 这样我们就可以找到主题的正确路径

## TODO

- 标签云
- 文章分类
- 更多类似 github card 的卡片