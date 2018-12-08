const db = require('../core/db');
class Exchange {
    findById(id) {

    }

    findByName(name) {

    }

    static async findAll() {
        return db.query('SELECT * from (SELECT DISTINCT(exchange) from exchanges_coins) ex');
    }

    create(payload) {

    }

    update(payload, id) {

    }
}

module.exports = Exchange;