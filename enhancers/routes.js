const Layout = () => import('../Layout');

/**
 * 注入路由
 * @param {*} Vue 
 * @param {*} param1 
 */
const install = (Vue, { router, themeConfig }) => {
    const navs = navsLocale(themeConfig.nav);
    const routes = [];
    
    // 通过 redirect 获取目录结构中设置了 index 的目录
    const navInRouter = router.options.routes
        .filter(route => route.redirect)
        .map(route => route.redirect);

    // 注入 root
    navs.forEach(nav => {
        if (nav.root &&
            nav.link &&
            !~navInRouter.indexOf(nav.link)) {
            routes.push({
                path: nav.link,
                component: Layout,
                name: `nav-${nav.text}`,
                meta: { root: true }
            })
        }
    });

    // 注入 tags
    if (Vue.options.tags.useTag) {
        routes.push({
            path: `${Vue.options.tags.path}:tagName?`,
            component: Layout,
            meta: { tag: true }
        })
    }

    router.addRoutes(routes);
}

const hasPath = (router, path) => {
    const routes = router.options.routes;
    for(let route of routes) {
        if (route.path === path) return true;
    }
    return false;
}

/**
 * 获取本地的 nav link
 * 过滤掉 http | https | // header
 * @param {Array} navs 
 */
const navsLocale = (navs) => {
    const localeReg = /^\/(?!\/).*/;

    return navs.filter(nav => nav.link && localeReg.test(nav.link))
}

export default { install }