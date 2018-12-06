export default ({ app }) => {
    /*
    ** Only run on client-side and only in production mode
    */
    if (process.env.NODE_ENV !== 'production') return
    /*
    ** Include section.io RUM
    */
    (function (v, a, d, e, r) {
        v['SectionioAnalyticsConfig'] = { sqrum: r };
        var js = a.createElement(d), where = a.getElementsByTagName(d)[0];
        js.src = e; where.parentNode.insertBefore(js, where);
        where.parentNode.insertBefore(js, where);
    }(window, document, 'script', 'https://awesome.section.io/js/4849/sqrum.js', '1469-2500-4849'));
}