import routes from './enhancers/routes';
import tags from './enhancers/tags';

export default ({ Vue, options, router, siteData }) => {
    const { themeConfig, pages } = siteData;

    Vue.use(routes, { router, themeConfig });
    Vue.use(tags, { router, pages, themeConfig });
}