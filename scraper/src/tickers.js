const ccxt = require('ccxt')
const { Pool } = require('pg')
const _ = require('lodash')

const DB_URL = process.env.DB_URL || 'postgres://postgres:postgres@localhost:5432/postgres?client_encoding=utf8'

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

let ccxtExchanges = {}

const pool = new Pool({
  connectionString: DB_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

const start = async () => {
  console.log('Start', Date.now())

  try {
    await pool.query('SELECT now()')
  } catch (error) {
    console.log('Exit', Date.now())
    process.exit(-1)
  }

  let exchanges = ccxt.exchanges
  for (const exchangeId of exchanges) {
    if (!ccxtExchanges[exchangeId]) {
      ccxtExchanges[exchangeId] = new ccxt[exchangeId]()
    }

    let exchange = ccxtExchanges[exchangeId]

    if (!exchange.has['fetchTickers']) {
      continue
    }

    worker(exchangeId, exchange)
  }
}

const worker = async (exchangeId, exchange) => {
  let rateLimit = exchange.rateLimit || 10 * 1000
  try {
    let markets = await exchange.load_markets()
    let pairs = Object.keys(markets)

    let chunks = _.chunk(pairs, 100)
    console.log(exchangeId, chunks.length)

    for (c of chunks) {
      let res = await exchange.fetchTickers(c)
      await saveTickers(exchangeId, res)
      console.log(`exchange: ${exchangeId}, pairs: ${Object.keys(res).length} fetched`)
    }
  } catch (e) {
    console.log('Error:', e.message)
  }

  await sleep(rateLimit * 10)
  worker(exchangeId, exchange)
}

const saveTickers = async (exchange, data) => {
  let tickers = []

  Object.keys(data).forEach(o => {
    let r = data[o]

    if (!r.symbol || !r.timestamp || !r.last) {
      return
    }
    let coin1 = r.symbol.split('/')[0]
    let coin2 = r.symbol.split('/')[1]

    let t = {
      exchange: exchange,
      coin1: coin1,
      coin2: coin2,
      time_stamp: parseInt(r.timestamp, 10),
      date_time: r.datetime,
      high: r.high || null,
      low: r.low || null,
      bid: r.bid || null,
      ask: r.ask || null,
      open: r.open || null,
      close: r.close || null,
      last: r.last || null,
      base_volume: r.baseVolume || null,
      quote_volume: r.quoteVolume || null
    }
    tickers.push(t)
  })
  if (!tickers.length) {
    return
  }
  let tickersJson = JSON.stringify(tickers)
  await pool.query(`select save_tickers_json( '${tickersJson}');`)
}

start()
