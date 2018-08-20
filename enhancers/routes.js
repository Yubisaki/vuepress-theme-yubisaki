const Layout = () => import('../Layout');

/**
 * Injection route
 * @param {*} Vue 
 * @param {*} param1 
 */
const install = (Vue, { router, themeConfig }) => {
    const navs = navsLocale(themeConfig.nav);
    const routes = [];
    
    // Get the directory with the index set in the directory structure via redirect
    const navInRouter = router.options.routes
        .filter(route => route.redirect)
        .map(route => route.redirect);

    // Inject root
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

    // Inject tags
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
 * Get local nav link
 * Filter out http | https | // header
 * @param {Array} navs 
 */
const navsLocale = (navs) => {
    const localeReg = /^\/(?!\/).*/;

    return navs.filter(nav => nav.link && localeReg.test(nav.link))
}

export default { install }