/**
 * 处理后面需要用到的 options, 挂载到 Vue 上
 * @param {*} themeConfig 主题配置
 */
const install = (Vue, { themeConfig }) => {
    const TAGS = '/tags/';

    const navs = themeConfig.nav;

    Vue.options = Vue.options || {};

    Vue.options.tags = {
        useTag: themeConfig.tags,
        path: TAGS
    }

    navs.forEach(nav => {
        if (nav.tags && nav.link) {
            Vue.options.tags.path = nav.link;
        }
    })

    Vue.mixin({
        computed: {
            $tagOptions() {
                return Vue.options.tags;
            }
        }
    })
}

export default { install }
