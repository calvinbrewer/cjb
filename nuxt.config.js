export default {
    srcDir: 'nuxt/',
    router: {
        base: '/nuxt/'
    },
    plugins: [
        { src: 'plugins/rum.js', ssr: false }
    ]
};