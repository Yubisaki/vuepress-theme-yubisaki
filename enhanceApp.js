import routes from './enhancers/routes';

export default ({ Vue, options, router, siteData }) => {
    console.log(Vue, options, router, siteData);
    const { themeConfig } = siteData;

    Vue.use(routes, { router, themeConfig });
}