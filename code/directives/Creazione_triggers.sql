USE db_supermercato;
CREATE OR REPLACE TRIGGER trg_email_check
    BEFORE INSERT
    ON utenti
    FOR EACH ROW
BEGIN
    IF (NEW.email REGEXP '[a-zA-Z0-9-_.]+@[a-zA-Z0-9-_.]+\.[a-zA-Z]{2,6}') = 0 THEN
        SIGNAL SQLSTATE '10001' SET MESSAGE_TEXT = 'Email non valida';
    END IF;
END;
CREATE OR REPLACE TRIGGER trg_coupon_exp
    BEFORE INSERT
    ON coupon_utilizzati
    FOR EACH ROW
BEGIN
    DECLARE coupon_exp DATETIME;
    SELECT coupons.scadenza INTO coupon_exp FROM coupons WHERE NEW.coupon = coupons.code;
    IF coupon_exp < NEW.data_utilizzo THEN
        SIGNAL SQLSTATE '10002' SET MESSAGE_TEXT = 'Coupon scaduto';
    END IF;
END;
CREATE OR REPLACE TRIGGER trg_coupon_amount
    BEFORE INSERT
    ON coupons
    FOR EACH ROW
BEGIN
    DECLARE product_price DECIMAL(6, 2);
    SELECT prodotti.prezzo INTO product_price FROM prodotti WHERE NEW.prodotto = prodotti.id;
    IF NEW.sconto > product_price THEN
        SIGNAL SQLSTATE '10003' SET MESSAGE_TEXT = 'Coupon con sconto troppo alto';
    END IF;
END;
CREATE OR REPLACE TRIGGER trg_price_update
    AFTER INSERT
    ON ordini_prodotti
    FOR EACH ROW
BEGIN
    DECLARE price DECIMAL(6, 2);
    DECLARE vat TINYINT(100);
    DECLARE discount DECIMAL(6, 2);
    SET discount = 0;
    IF NEW.coupon_utilizzato IS NOT NULL THEN
        SELECT sconto INTO discount FROM coupons WHERE code = NEW.coupon_utilizzato;
    END IF;
    SELECT prezzo,iva INTO price,vat FROM prodotti WHERE prodotti.id = NEW.prodotto;
    UPDATE ordini SET spesa_totale = spesa_totale + ((price - discount)*(1+vat/100))*NEW.quantita WHERE ordini.id = NEW.ordine;
END;