const Coin = require('../models/coin');

class CoinController {
    static async getCoin(req, res) {
        const result = await Coin.findAll();
        res.send(result.rows.map(coin => coin.coin));
    }
}

module.exports = CoinController;
