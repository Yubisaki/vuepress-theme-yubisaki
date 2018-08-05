import { pageNormalize } from '../lib/util';

const install = (Vue, { router, pages, themeConfig }) => {
    const navs = themeConfig.nav;
    const pagesWithoutLayout = pageNormalize(pages, navs);
    
    const tagMap = {};

    pagesWithoutLayout.forEach(page => {
        if (page.frontmatter && page.frontmatter.tag) {
            const tag = page.frontmatter.tag;
            if (typeof tag === 'string') {
                insertTag(tagMap, tag, page.key);
            } else {
                tag.forEach(t => insertTag(tagMap, t, page.key));
            }
        }
    })

    Vue.mixin({
        computed: {
            $tags() {
                return tagMap;
            }
        }
    });
}

const insertTag = (tagMap, tag, key) => {
    if (!tagMap[tag]) {
        tagMap[tag] = [key];
    } else {
        tagMap[tag].push(key);
    }
}

export default { install };
