USE db_supermercato;
CREATE OR REPLACE PROCEDURE sp_ottieniUtentiProfilazione(id INT)
BEGIN
    SELECT profilazione.utente AS utente, utenti.email AS email, profilazione.data_profilazione AS data
    FROM profilazione INNER JOIN utenti ON profilazione.utente = utenti.id
    WHERE profilazione.data_profilazione > DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
      AND profilazione.categoria = id;
END;
CREATE OR REPLACE PROCEDURE sp_couponUsati(id INT)
BEGIN
    SELECT coupon_utilizzati.coupon AS coupon
    FROM coupon_utilizzati
    WHERE utente = id
    ORDER BY coupon_utilizzati.data_utilizzo DESC;
END;
CREATE OR REPLACE PROCEDURE sp_updateProfilation()
BEGIN
    INSERT INTO profilazione (utente, categoria, data_profilazione)
    SELECT ordini.utente as utente, prodotti.categoria, CURTIME()
    FROM ordini_prodotti
             INNER JOIN ordini ON ordini_prodotti.ordine = ordini.id
             INNER JOIN prodotti ON ordini_prodotti.prodotto = prodotti.id
    WHERE ordini.data_ordine > DATE_SUB(CURDATE(), INTERVAL 2 DAY)
    ON DUPLICATE KEY UPDATE data_profilazione = CURTIME();
END;
CREATE OR REPLACE PROCEDURE sp_ricevuta(id INT)
BEGIN
    SELECT ordini_prodotti.prodotto AS prodotto,
           prodotti.nome            AS nome,
           prodotti.prezzo          AS prezzo,
           prodotti.iva             AS iva,
           ordini_prodotti.quantita AS quantita,
           coupons.sconto           AS sconto,
           coupons.code             AS coupon
    FROM ordini_prodotti
             INNER JOIN prodotti ON ordini_prodotti.prodotto = prodotti.id
             LEFT JOIN coupons ON ordini_prodotti.coupon_utilizzato = coupons.code
    WHERE ordini_prodotti.ordine = id;
END;