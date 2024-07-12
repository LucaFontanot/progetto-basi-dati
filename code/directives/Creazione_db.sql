CREATE TABLE IF NOT EXISTS utenti
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    email         VARCHAR(80) NOT NULL UNIQUE,
    password      VARCHAR(32) NOT NULL,
    nome          varchar(40) NOT NULL,
    cognome       varchar(40) NOT NULL,
    registrazione DATETIME default CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS categorie
(
    id    INT PRIMARY KEY AUTO_INCREMENT,
    nome  VARCHAR(80) NOT NULL,
    padre INT DEFAULT NULL,
    FOREIGN KEY (padre) REFERENCES categorie (id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS prodotti
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    nome      VARCHAR(80) NOT NULL,
    prezzo    DECIMAL(6, 2) UNSIGNED DEFAULT 0,
    iva       TINYINT(100) UNSIGNED  DEFAULT 22,
    categoria INT                    DEFAULT NULL,
    FOREIGN KEY (categoria) REFERENCES categorie (id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS coupons
(
    code        VARCHAR(20) PRIMARY KEY,
    descrizione TEXT                   DEFAULT NULL,
    scadenza    DATETIME NOT NULL,
    sconto      DECIMAL(6, 2) UNSIGNED DEFAULT 0,
    prodotto    INT      NOT NULL,
    FOREIGN KEY (prodotto) REFERENCES prodotti (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS ordini
(
    id           INT PRIMARY KEY AUTO_INCREMENT,
    data_ordine  DATETIME      DEFAULT CURRENT_TIMESTAMP,
    spesa_totale DECIMAL(6, 2) DEFAULT 0,
    utente       INT NOT NULL,
    FOREIGN KEY (utente) REFERENCES utenti (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS ordini_prodotti
(
    ordine            INT NOT NULL,
    prodotto          INT NOT NULL,
    coupon_utilizzato VARCHAR(20) DEFAULT NULL,
    quantita          INT         DEFAULT 1,
    PRIMARY KEY (ordine, prodotto),
    FOREIGN KEY (ordine) REFERENCES ordini (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (prodotto) REFERENCES prodotti (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (coupon_utilizzato) REFERENCES coupons (code) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS coupon_utilizzati
(
    coupon        VARCHAR(20) NOT NULL,
    utente        INT         NOT NULL,
    data_utilizzo DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (coupon, utente),
    FOREIGN KEY (coupon) REFERENCES coupons (code) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (utente) REFERENCES utenti (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS profilazione
(
    utente            INT,
    categoria         INT,
    data_profilazione DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (utente, categoria),
    FOREIGN KEY (utente) REFERENCES utenti (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (categoria) REFERENCES categorie (id) ON DELETE CASCADE ON UPDATE CASCADE
);