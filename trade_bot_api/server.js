const fastify = require('fastify')({
    logger: true
});

fastify.register(require('fastify-cors'), { methods:['GET', 'OPTIONS']});

const routes = require('./routes');

fastify.register(routes);

const start = async () => {
    try {
        await fastify.listen(3000, '0.0.0.0');
        fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();