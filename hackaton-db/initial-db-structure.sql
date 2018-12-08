CREATE USER hackaton WITH PASSWORD 'hackatonpwd';
CREATE SCHEMA IF NOT EXISTS hackaton;
GRANT ALL PRIVILEGES ON DATABASE postgres TO hackaton;

create table if not exists exchanges_coins
(exchange text not null,
 coin1 text not null,
 coin2 text not null, 
CONSTRAINT exchanges_coins_uniq UNIQUE (exchange, coin1, coin2)
);

insert into exchanges_coins(exchange, coin1, coin2)
values
('gdax','BTC', 'USD'),
('gdax','ETH', 'USD'),
('gdax','XRP', 'USD'),
('gdax','LTC', 'USD'),
('bittrex','BTC', 'USD'),
('bittrex','ETH', 'USD'),
('bittrex','LTC', 'USD'),
('bittrex','XRP', 'USD')
on conflict do nothing
;

create table if not exists timeframe_data(
id serial,
timeframe_in_minutes int not null,
time_stamp timestamptz not null,
exchange text,
coin1 text,
coin2 text,
deals_count int,
volume numeric,
avg_price numeric,
last_trade_price numeric,
last_trade_amount numeric,
last_trade_timestamp  timestamptz,
CONSTRAINT timeframe_data_uniq UNIQUE (time_stamp, exchange, coin1, coin2)
);


CREATE table tickers (
        id              bigserial,
        exchange        text,
        coin1           text,
        coin2           text,
        time_stamp      bigint,
        date_time       timestamp,
        high            numeric,
        low             numeric,
        bid             numeric,
        ask             numeric,
        open            numeric,
        close           numeric,
        last_price      numeric,
        base_volume     numeric,
        quote_volume    numeric
);

--create unique index ON tickers using btree (exchange, coin1, coin2, time_stamp);

 
CREATE table  tickers_stagging (
        exchange        text,
        coin1           text,
        coin2           text,
        time_stamp      bigint,
        date_time       timestamp,
        high            numeric,
        low             numeric,
        bid             numeric,
        ask             numeric,
        open            numeric,
        close           numeric,
        last_price      numeric,
        base_volume     numeric,
        quote_volume    numeric
);


CREATE TABLE tickers_last_price (
	exchange text NULL,
	coin1 text NULL,
	coin2 text NULL,
	last_price numeric NULL,
	time_stamp int8 NULL
);

create  index tickers_last_price_idx  ON tickers_last_price using btree (exchange, coin1, coin2);

create function save_tickers_json(p_data json)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  truncate table tickers_stagging;

  INSERT INTO tickers_stagging(exchange, coin1, coin2, time_stamp, date_time, high, low, bid, ask, open, close, last_price, base_volume, quote_volume)
  select exchange, coin1, coin2, time_stamp, date_time, high, low, bid, ask, "open", "close", coalesce("last",1), base_volume, quote_volume
  from json_to_recordset(p_data) as x(exchange text, coin1 text, coin2 text, time_stamp int8, date_time timestamp, high numeric, low numeric, bid numeric, ask numeric, "open" numeric, "close" numeric, "last" numeric, base_volume numeric, quote_volume numeric)
  on conflict do nothing;

  insert into tickers_last_price(exchange, coin1, coin2, last_price, time_stamp)
  select exchange, coin1, coin2, last_price, time_stamp
  from tickers_stagging
  where (exchange, coin1, coin2) in (select exchange, coin1, coin2 from tickers_stagging
                                     except
                                     select exchange, coin1, coin2 from tickers_last_price);

  with ds as (select ts.exchange, ts.coin1, ts.coin2, ts.last_price, ts.time_stamp
              from tickers_last_price lp,
                   tickers_stagging ts
              where lp.exchange = ts.exchange
                and lp.coin1 = ts.coin1
                and lp.coin2 = ts.coin2)
  update tickers_last_price
  set last_price       = ds.last_price,
      time_stamp = ds.time_stamp
  from ds
  where ds.exchange = tickers_last_price.exchange
    and ds.coin1 = tickers_last_price.coin1
    and ds.coin2 = tickers_last_price.coin2;

  insert into tickers(exchange, coin1, coin2, time_stamp, date_time, high, low, bid, ask, "open", "close", "last_price", base_volume, quote_volume)
  select exchange, coin1, coin2, time_stamp, date_time, high, low, bid, ask, "open", "close", "last_price", base_volume, quote_volume
  from tickers_stagging;

end;
$function$;


create function get_last_price_per_exchange(p_coin1 text, p_coin2 text)
  returns TABLE(exchange text, coin1 text, coin2 text, last_price numeric, coin_path text, order_type text)
language plpgsql
as
$function$
begin
  return query (with ds as (select lp.exchange, lp.coin1, lp.coin2, lp.last_price, lp.coin1||'/'||lp.coin2 as coin_path
                            from tickers_last_price lp
                            where lp.coin1 = p_coin1
                              and lp.coin2 = p_coin2
                            union all
                            select lp.exchange, lp.coin1, lp.coin2, 1 / lp.last_price as last_price, lp.coin1||'/'||lp.coin2 as coin_path
                            from tickers_last_price lp
                            where lp.coin2 = p_coin1
                              and lp.coin1 = p_coin2
                            union all
                            select lp1.exchange,
                                   lp1.coin1,
                                   lp2.coin1                                 as coin2,
                                   lp1.last_price / lp2.last_price           as last_price,
                                   lp1.coin1||'/'||lp2.coin2||'/'||lp2.coin1 as coin_path
                            from tickers_last_price lp1,
                                 tickers_last_price lp2
                            where lp1.exchange = lp2.exchange
                              and lp1.coin1 = p_coin1
                              and lp2.coin1 = p_coin2
                              and lp1.coin2 = lp2.coin2
                            union all
                            select lp1.exchange,
                                   lp1.coin1,
                                   lp2.coin2                                 as coin2,
                                   lp1.last_price * lp2.last_price           as last_price,
                                   lp1.coin1||'/'||lp2.coin1||'/'||lp2.coin1 as coin_path
                            from tickers_last_price lp1,
                                 tickers_last_price lp2
                            where lp1.exchange = lp2.exchange
                              and lp1.coin1 = p_coin1
                              and lp2.coin2 = p_coin2
                              and lp1.coin2 = lp2.coin1)
    , lowest as
    (select ds.exchange, ds.coin1, ds.coin2, ds.last_price, ds.coin_path, 'lowest' as order_type from ds order by last_price limit 5)
    , highest as (select ds.exchange, ds.coin1, ds.coin2, ds.last_price, ds.coin_path, 'highest' as order_type
                  from ds
                  order by last_price desc
                  limit 5)
  select l.exchange, l.coin1, l.coin2, l.last_price, l.coin_path, l.order_type from lowest l
  union all
  select h.exchange, h.coin1, h.coin2, h.last_price, h.coin_path, h.order_type from highest h);
end;
$function$;



create or replace view v_available_coins as
  select coin1 as coin
  from tickers_last_price
  union
  select coin2 as coin
  from tickers_last_price;

create or replace function get_last_avg_weighted_price(p_coin1 text, p_coin2 text)
  returns TABLE(pair text, time_stamp timestamp with time zone, last_avg_weighted_price numeric)
language plpgsql
as
$function$
begin
  return query (select lp.coin1||'/'||lp.coin2 as pair, now() as time_stamp, avg(lp.last_price) last_avg_weighted_price
                from tickers_last_price lp
                where lp.coin1 = p_coin1
                  and lp.coin2 = p_coin2
                group by lp.coin1, lp.coin2);

end;
$function$;

