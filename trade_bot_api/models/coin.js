const db = require('../core/db');

class Coin {
    async findById(id) {

    }

    findByName(name) {

    }

    static async findAll() {
        return db.query('SELECT coin from v_available_coins');
    }

    create(payload) {

    }

    update(payload, id) {

    }
}

module.exports = Coin;