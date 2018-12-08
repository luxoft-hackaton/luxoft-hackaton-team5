const PriceController = require('../controllers/price');
const optsAvg = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    timestamp: {type: 'string'},
                    price: {type: 'number'},
                    pair: {type: 'string'},
                }
            }
        },
        querystring: {
            type: 'object',
            properties: {
                from: {
                    type: 'string'
                },
                to: {
                    type: 'string'
                },
            },
            required: ['from', 'to']
        },
    }
};

const opts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        coin_path: {type: 'string'},
                        price: {type: 'number'},
                        order_type: {type: 'string'},
                        pair: {type: 'string'},
                        exchange: {type: 'string'},
                    },
                }
            }
        },
        querystring: {
            type: 'object',
            properties: {
                from: {
                    type: 'string'
                },
                to: {
                    type: 'string'
                },
            },
            required: ['from', 'to']
        },
    }
};
const priceRoutes = [
    {
        method: 'get',
        path: '/price',
        options: opts,
        handler: PriceController.getPrice
    },
    {
        method: 'get',
        path: '/price/average',
        options: optsAvg,
        handler: PriceController.getAveragePrice
    },

];

module.exports = priceRoutes;