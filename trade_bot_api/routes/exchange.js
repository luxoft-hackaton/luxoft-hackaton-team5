const ExchangeController = require('../controllers/exchange');
const opts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'string',
                }
            }
        }
    }
};
const ExchangeRoutes = [
    {
        method: 'get',
        path: '/exchange',
        options: opts,
        handler: ExchangeController.getExchange
    }
];

module.exports = ExchangeRoutes;