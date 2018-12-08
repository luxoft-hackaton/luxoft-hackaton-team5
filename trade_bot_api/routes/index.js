const priceRoutes = require('./price');
const exchangeRoutes = require('./exchange');
const coinRoutes = require('./coin');

async function routes(fastify) {
    const routes = [...priceRoutes, ...exchangeRoutes, ...coinRoutes];
    routes.forEach(route => {
        fastify[route.method](route.path, route.options, route.handler)
    });
}

module.exports = routes;
