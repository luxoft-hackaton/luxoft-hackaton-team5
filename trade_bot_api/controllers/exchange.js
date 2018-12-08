const Exchange = require('../models/exchange');
class ExchangeController {
    static async getExchange(req, res) {
        const result = await Exchange.findAll();
        res.send(result.rows.map(row=>row.exchange));
    }
}

module.exports = ExchangeController;