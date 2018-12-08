const CoinController = require('../controllers/coin');
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
const coinRoutes = [
    {
        method: 'get',
        path: '/coin',
        options: opts,
        handler: CoinController.getCoin
    }
];

module.exports = coinRoutes;