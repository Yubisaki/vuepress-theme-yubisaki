export const hashRE = /#.*$/
export const indexRE = /(.+\/)index$/
export const navLayoutRE = /(\/.+\/)(.*)$/g
export const extRE = /\.(md|html)$/
export const endingSlashRE = /\/$/
export const outboundRE = /^(https?:|mailto:)/

export function normalize (path) {
  return path
    .replace(hashRE, '')
    .replace(extRE, '')
}

export function getHash (path) {
  const match = path.match(hashRE)
  if (match) {
    return match[0]
  }
}

export function isExternal (path) {
  return outboundRE.test(path)
}

export function isMailto (path) {
  return /^mailto:/.test(path)
}

export function ensureExt (path) {
  if (isExternal(path)) {
    return path
  }
  const hashMatch = path.match(hashRE)
  const hash = hashMatch ? hashMatch[0] : ''
  const normalized = normalize(path)

  if (endingSlashRE.test(normalized)) {
    return path
  }
  return normalized + '.html' + hash
}

export function isActive (route, path) {
  const routeHash = route.hash
  const linkHash = getHash(path)
  if (linkHash && routeHash !== linkHash) {
    return false
  }
  const routePath = normalize(route.path)
  const pagePath = normalize(path)
  if (endingSlashRE.test(routePath) || endingSlashRE.test(pagePath)) {
    return routePath === pagePath
  } else {
    return routePath.indexOf(pagePath) === 0
  }
}

export function getTitle (siteTitle, page) {
  if(page.frontmatter.activity) {
    return page.frontmatter.title || siteTitle
  }

  return siteTitle
}

export function layoutsFromNav(navs) {
  return navs.reduce((layouts, nav) => 
    layouts.concat(nav.layout || []), [])
}

export function excludeFeature (page) {
  return (!page.frontmatter.date || 
          +new Date(page.frontmatter.date) <= +new Date())
}

// Filter out pages with a unique layoutTag flag
export function pageWithCustomLayout(pages, navs, layout) {
  const navList = navs || [] 
  const navLinks = navList.map(n => navsLinksNormalize(n.link))
  const pagesWithoutRoot = pages
    .filter(
      page => page.path !== '/' && // exclude root
        excludeFeature(page) && // exclude page.date > current time
        !~navLinks.indexOf(page.path) && // nav link
        !isHidden(page) && // page.frontmatter.hidden
        page.frontmatter.layoutTag === layout // layout tag
    ) 
  return pageSortByDate(pagesWithoutRoot)
}

// Pages that appear in themeConfig.nav, as well as pages with layoutTag in nav are filtered
export function pageNormalize(pages, navs) {
  const layouts = layoutsFromNav(navs)
  const navList = navs || []
  const navLinks = navList.map(n => navsLinksNormalize(n.link))
  const withoutRoot = pages
    .filter(
      page => page.path !== '/' && 
        excludeFeature(page) && // exclude page.date > current time
        !~layouts.indexOf(page.frontmatter.layoutTag) &&
        !~navLinks.indexOf(page.path) &&
        !isHidden(page)
    )
  return pageSortByDate(withoutRoot)
}

// /about/index ==> /about/
export function navsLinksNormalize(link) {
  const re = link.match(indexRE)
  return re ? re[1] : link 
}

export function isHidden(page) {
  if(!page.frontmatter) return false
  return page.frontmatter.hidden
}

// pages sort by date
export function pageSortByDate (pages) {
  const pageWithDate = pages
    .filter(page => page.frontmatter.date )
  const pageWithOutDate = pages
    .filter(page => !page.frontmatter.date )

  let mapped = pageWithDate
    .map((p, i) => ({ index: i, date: +new Date(p.frontmatter.date) }))

  mapped.sort((a, b) => {
    if(a.date > b.date) {
      return -1
    }
    if(a.date < b.date) {
      return 1
    }
    return 0
  }) 
  return mapped.map(m => pageWithDate[m.index]).concat(pageWithOutDate)
}

export function resolvePage (pages, rawPath, base) {
  if (base) {
    rawPath = resolvePath(rawPath, base)
  }
  const path = normalize(rawPath)
  for (let i = 0; i < pages.length; i++) {
    if (normalize(pages[i].path) === path) {
      return Object.assign({}, pages[i], {
        type: 'page',
        path: ensureExt(rawPath)
      })
    }
  }
  console.error(`[vuepress] No matching page found for sidebar item "${rawPath}"`)
  return {}
}

function resolvePath (relative, base, append) {
  const firstChar = relative.charAt(0)
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  const stack = base.split('/')

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop()
  }

  // resolve relative path
  const segments = relative.replace(/^\//, '').split('/')
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    if (segment === '..') {
      stack.pop()
    } else if (segment !== '.') {
      stack.push(segment)
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('')
  }

  return stack.join('/')
}

export function resolveSidebarItems (page, route, site, localePath) {
  const pageSidebarConfig = page.frontmatter.sidebar
  if (pageSidebarConfig === 'auto') {
    return resolveHeaders(page)
  }
  const { pages, themeConfig } = site

  const localeConfig = localePath && themeConfig.locales
    ? themeConfig.locales[localePath] || themeConfig
    : themeConfig

  const sidebarConfig = localeConfig.sidebar || themeConfig.sidebar
  if (!sidebarConfig) {
    return []
  } else {
    const { base, config } = resolveMatchingConfig(route, sidebarConfig)
    return config
      ? config.map(item => resolveItem(item, pages, base))
      : []
  }
}

function resolveHeaders (page) {
  const headers = groupHeaders(page.headers || [])
  return [{
    type: 'group',
    collapsable: false,
    title: page.title,
    children: headers.map(h => ({
      type: 'auto',
      title: h.title,
      basePath: page.path,
      path: page.path + '#' + h.slug,
      children: h.children || []
    }))
  }]
}

export function groupHeaders (headers) {
  // group h3s under h2
  headers = headers.map(h => Object.assign({}, h))
  let lastH2
  headers.forEach(h => {
    if (h.level === 2) {
      lastH2 = h
    } else if (lastH2) {
      (lastH2.children || (lastH2.children = [])).push(h)
    }
  })
  return headers.filter(h => h.level === 2)
}

export function resolveNavLinkItem (linkItem) {
  return Object.assign(linkItem, {
    type: linkItem.items && linkItem.items.length ? 'links' : 'link'
  })
}

export function resolveMatchingConfig (route, config) {
  if (Array.isArray(config)) {
    return {
      base: '/',
      config: config
    }
  }
  for (const base in config) {
    if (ensureEndingSlash(route.path).indexOf(base) === 0) {
      return {
        base,
        config: config[base]
      }
    }
  }
  return {}
}

function ensureEndingSlash (path) {
  return /(\.html|\/)$/.test(path)
    ? path
    : path + '/'
}

function resolveItem (item, pages, base, isNested) {
  if (typeof item === 'string') {
    return resolvePage(pages, item, base)
  } else if (Array.isArray(item)) {
    return Object.assign(resolvePage(pages, item[0], base), {
      title: item[1]
    })
  } else {
    if (isNested) {
      console.error(
        '[vuepress] Nested sidebar groups are not supported. ' +
        'Consider using navbar + categories instead.'
      )
    }
    const children = item.children || []
    return {
      type: 'group',
      title: item.title,
      children: children.map(child => resolveItem(child, pages, base, true)),
      collapsable: item.collapsable !== false
    }
  }
}

Date.prototype.Format = function (fmt) {
	var o = {
		"y+": this.getFullYear(),
		"M+": this.getMonth() + 1, // month
		"d+": this.getDate(), // day
		"H+": this.getHours(), // hour
		"m+": this.getMinutes(), // Minute
		"s+": this.getSeconds(), // Seconds
		"q+": Math.floor((this.getMonth() + 3) / 3), // Quarter
		"S": this.getMilliseconds() // millisecond
	};
	if (!fmt) fmt = 'yyyy-MM-dd HH:mm:ss'
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	return fmt;
}