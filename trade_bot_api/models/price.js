const db = require('../core/db');
class Price {
    find(filter) {

    }

    static async findAll(from, to) {
        return db.query(`SELECT coin1||'/'||coin2 as pair, exchange, last_price as price,
          coin_path, order_type from 
        get_last_price_per_exchange($1,$2)`, [from, to]);
    }

    static async findAvg(from, to) {
        return db.query(`SELECT * from get_last_avg_weighted_price($1, $2)`, [from, to]);
    }

    create(payload) {

    }

    update(payload, id) {

    }
}

module.exports = Price;