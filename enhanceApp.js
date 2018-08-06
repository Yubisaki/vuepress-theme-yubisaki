import routes from './enhancers/routes';
import tags from './enhancers/tags';
import optionHandler from './enhancers/optionHandler';

export default ({ Vue, options, router, siteData }) => {
    const { themeConfig, pages } = siteData;

    Vue.use(optionHandler, { themeConfig });
    Vue.use(routes, { router, themeConfig });
    Vue.use(tags, { router, pages, themeConfig });
}