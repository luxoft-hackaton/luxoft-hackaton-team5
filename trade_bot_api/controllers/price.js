const Price = require('../models/price');

class PriceController {
    static async getPrice(req, res) {
        const result = await Price.findAll(req.query.from, req.query.to);
        res.send(result.rows.map(price => price));
    }

    static async getAveragePrice(req, res) {
        const result = await Price.findAvg(req.query.from, req.query.to);
        const normalizedResult = result.rows[0];
        if (normalizedResult){
            res.send({price:normalizedResult.last_avg_weighted_price, pair:normalizedResult.pair,
                timestamp:normalizedResult.time_stamp});
        } else {
            res.send({});
        }
    }
}

module.exports = PriceController;
