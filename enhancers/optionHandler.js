/**
 * 处理后面需要用到的 options, 挂载到 Vue 上
 * @param {*} themeConfig 主题配置
 */
const install = (Vue, { themeConfig }) => {
    const TAGS = '/tags/';
    const ROOT = '/';

    const navs = themeConfig.nav;

    Vue.options = Vue.options || {};

    const tagsOption = {
        useTag: themeConfig.tags,
        path: TAGS
    }

    const rootOption = {
        path: ROOT
    }

    navs.forEach(nav => {
        if (nav.tags && nav.link) {
            tagsOption.path = nav.link;
        }
        if (nav.root && nav.link) {
            rootOption.path = nav.link;
        }
    })

    Vue.options.tags = tagsOption;
    Vue.options.root = rootOption;

    Vue.mixin({
        computed: {
            $tagOptions() {
                return Object.assign({}, tagsOption);
            },
            $rootOptions() {
                return Object.assign({}, rootOption);
            }
        }
    })
}

export default { install }
