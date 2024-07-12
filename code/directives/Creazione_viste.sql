USE db_supermercato;
CREATE OR REPLACE VIEW utilizzi_coupons AS
SELECT coupon_utilizzati.coupon                 AS coupon,
       YEAR(coupon_utilizzati.data_utilizzo)    AS anno,
       MONTH(coupon_utilizzati.data_utilizzo)   AS mese,
       COUNT(*) AS utilizzi
FROM coupon_utilizzati
GROUP BY coupon, anno, mese
ORDER BY anno DESC, mese DESC;
CREATE OR REPLACE VIEW fatturato_mesi AS
SELECT YEAR(ordini.data_ordine)  AS anno,
       MONTH(ordini.data_ordine) AS mese,
       SUM(ordini.spesa_totale)  AS fatturato
FROM ordini
GROUP BY anno, mese
ORDER BY anno DESC, mese DESC;
