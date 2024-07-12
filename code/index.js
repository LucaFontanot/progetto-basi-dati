const sql = require("./connection");
const express = require("express");
const app = express();
const {faker} = require("@faker-js/faker/locale/it");
const {uuid} = require('uuidv4');
const md5 = require('md5');
const cors = require("cors");

app.use(cors());
app.use(express.json());
function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

app.get("/api/health", async (req, res) => {
    const sysql = await sql.query("SELECT 1");
    const database = await sql.query("SELECT 1 FROM utenti WHERE 1=0");
    const tables = await sql.query("SELECT COUNT(*) as c FROM utenti");
    res.json({
        system: true,
        sql: sysql !== null,
        database: database !== null,
        tables: tables !== null && tables[0].c > 0
    });
});
let mock = [];
app.post("/api/mock/start", async (req, res) => {
    mock = [];
    res.json({success: true});
    mock.push(new Date().toISOString() + " - Mock started");
    await sql.executeFile("./directives/Creazione_db.sql");
    mock.push(new Date().toISOString() + " - Database created");
    await sql.executeFile("./directives/Creazione_procedure.sql");
    mock.push(new Date().toISOString() + " - Procedures created");
    await sql.executeFile("./directives/Creazione_viste.sql");
    mock.push(new Date().toISOString() + " - Views created");
    await sql.executeFile("./directives/Creazione_triggers.sql");
    mock.push(new Date().toISOString() + " - Triggers created");
    let randomUsers = randomBetween(5000, 10000);
    mock.push(new Date().toISOString() + " - Inserting " + randomUsers + " users");
    let users = [];
    for (let i = 1; i <= randomUsers; i++) {
        users.push([
            i,
            uuid() + faker.internet.email(),
            md5(faker.internet.password()),
            faker.person.firstName(),
            faker.person.lastName()
        ]);
        if (i % 1000 === 0 || i === randomUsers) {
            await sql.query("INSERT INTO utenti (id,email,password,nome,cognome) VALUES ?", [users]);
            users = [];
            mock.push(new Date().toISOString() + " - Inserted " + i + " users");
        }
    }
    mock.push(new Date().toISOString() + " - Users inserted");
    const randomCategories = randomBetween(10, 200);
    mock.push(new Date().toISOString() + " - Inserting " + randomCategories + " categories");
    let categories = [];
    for (let i = 1; i <= randomCategories; i++) {
        let padre = null;
        if (randomBetween(1, 10) === 1 && i > 1) {
            padre = randomBetween(1, i - 1);
        }
        categories.push([
            i,
            faker.commerce.department(),
            padre
        ]);
    }
    await sql.query("INSERT INTO categorie (id,nome, padre) VALUES ?", [categories]);
    mock.push(new Date().toISOString() + " - Categories inserted");
    const randomProducts = randomCategories * 20;
    mock.push(new Date().toISOString() + " - Inserting " + randomProducts + " products");
    let products = [];
    for (let i = 1; i <= randomProducts; i++) {
        products.push([
            i,
            faker.commerce.productName(),
            (randomBetween(100, 300)/100).toFixed(2),
            randomBetween(1, 22),
            randomBetween(1, randomCategories),
        ]);
        if (i % 1000 === 0 || i === randomProducts) {
            await sql.query("INSERT INTO prodotti (id,nome,prezzo,iva,categoria) VALUES ?", [products]);
            products = [];
            mock.push(new Date().toISOString() + " - Inserted " + i + " products");
        }
    }
    mock.push(new Date().toISOString() + " - Products inserted");
    const randomCoupons = randomBetween(10, 100);
    mock.push(new Date().toISOString() + " - Inserting " + randomCoupons + " coupons");
    let coupons = [];
    let coupon_names = [];
    let coupons_products = {};
    for (let i = 1; i <= randomCoupons; i++) {
        let name = faker.string.alphanumeric(10);
        while (coupon_names.includes(name)) {
            name = faker.string.alphanumeric(10);
        }
        let product = randomBetween(1, randomProducts);
        if (coupons_products[product] === undefined) {
            coupons_products[product] = [];
        }
        coupons_products[product].push(name);
        coupon_names.push(name);
        coupons.push([
            name,
            faker.lorem.sentence(),
            faker.date.future(),
            (randomBetween(1, 100)/100).toFixed(2),
            product
        ]);
    }
    await sql.query("INSERT INTO coupons (code,descrizione,scadenza,sconto,prodotto) VALUES ?", [coupons]);
    mock.push(new Date().toISOString() + " - Coupons inserted");
    const randomOrders = randomUsers * 3;
    mock.push(new Date().toISOString() + " - Inserting " + randomOrders + " orders");
    for (let i = 1; i <= randomOrders; i++) {
        let user = randomBetween(1, randomUsers);
        let order = [
            i,
            faker.date.past(),
            user,
        ];
        await sql.query("INSERT INTO ordini (id,data_ordine,utente) VALUES ?", [[order]]);
        let randomProductsInOrder = randomBetween(1, 10);
        let productsInOrder = [];
        for (let j = 1; j <= randomProductsInOrder; j++) {
            let applyCoupon = null;
            let product = randomBetween(1, randomProducts);
            if (randomBetween(1, 10) === 1) {
                if (coupons_products[product] !== undefined) {
                    applyCoupon = coupons_products[product][randomBetween(0, coupons_products[product].length - 1)];
                    let c = [
                        applyCoupon,
                        user
                    ]
                    await sql.query("INSERT INTO coupon_utilizzati (coupon,utente) VALUES ?", [[c]])
                }
            }
            productsInOrder.push([
                i,
                product,
                applyCoupon,
                randomBetween(1, 10)
            ]);
        }
        await sql.query("INSERT INTO ordini_prodotti (ordine,prodotto,coupon_utilizzato,quantita) VALUES ?", [productsInOrder]);
        if (i % 1000 === 0 || i === randomOrders) {
            mock.push(new Date().toISOString() + " - Inserted " + i + " orders");
        }
    }
    mock.push(new Date().toISOString() + " - Orders inserted");
    await sql.query("CALL sp_updateProfilation()")
    mock.push(new Date().toISOString() + " - Profilation updated");
    mock.push("ENDED");
})
app.get("/api/mock/status", async (req, res) => {
    res.json(mock);
})
//-------------------API FOR USERS-------------------
app.post("/api/users", async (req, res) => {
    let itemsPerPage = req.body.itemsPerPage;
    let page = req.body.page;
    let search = req.body.search;
    let users = await sql.prepared("SELECT * FROM utenti WHERE id LIKE ? LIMIT ? OFFSET ?", ["%"+search+"%", itemsPerPage, (page - 1) * itemsPerPage]);
    let count = await sql.prepared("SELECT COUNT(*) as c FROM utenti WHERE id LIKE ?", ["%"+search+"%"]);
    res.json({users: users, count: count[0].c});
});
app.get("/api/coupons/user/:id", async (req, res) => {
    let coupons = await sql.prepared("CALL sp_couponUsati(?)", [req.params.id]);
    res.json(coupons[0]);
})
app.get("/api/orders/user/:id", async (req, res) => {
    let orders = await sql.prepared("SELECT * FROM ordini WHERE utente = ?", [req.params.id]);
    res.json(orders);
})
app.post("/api/users/del/:id", async (req, res) => {
    await sql.prepared("DELETE FROM utenti WHERE id = ?", [req.params.id]);
    res.json({success: true});
})
//-------------------API FOR PRODUCTS-------------------
app.post("/api/products", async (req, res) => {
    let itemsPerPage = req.body.itemsPerPage;
    let page = req.body.page;
    let search = req.body.search;
    let products = await sql.prepared("SELECT prodotti.id AS id, prodotti.nome AS nome, prodotti.prezzo AS prezzo, prodotti.iva AS iva, prodotti.categoria AS cid, categorie.nome AS categoria FROM prodotti INNER JOIN categorie ON categorie.id = prodotti.categoria  WHERE prodotti.id LIKE ? ORDER BY prodotti.id ASC LIMIT ? OFFSET ?", ["%"+search+"%", itemsPerPage, (page - 1) * itemsPerPage]);
    let count = await sql.prepared("SELECT COUNT(*) as c FROM prodotti WHERE id LIKE ?", ["%"+search+"%"]);
    res.json({products: products, count: count[0].c});
});
app.post("/api/products/del/:id", async (req, res) => {
    await sql.prepared("DELETE FROM prodotti WHERE id = ?", [req.params.id]);
    res.json({success: true});
})
//-------------------API FOR CATEGORIES-------------------
app.get("/api/categories", async (req, res) => {
    let categories = await sql.query("SELECT * FROM categorie");
    res.json(categories);
})
app.post("/api/categories/del/:id", async (req, res) => {
    await sql.prepared("DELETE FROM categorie WHERE id = ?", [req.params.id]);
    res.json({success: true});
})
app.get("/api/categories/profilation/:id", async (req, res) => {
    let profilation = await sql.prepared("CALL sp_ottieniUtentiProfilazione(?)", [req.params.id]);
    res.json(profilation[0]);
});
app.post("/api/categories/profilation/update", async (req, res) => {
    await sql.query("CALL sp_updateProfilation()");
    res.json({success: true});
});
//-------------------API FOR COUPONS-------------------
app.post("/api/coupons", async (req, res) => {
    let itemsPerPage = req.body.itemsPerPage;
    let page = req.body.page;
    let search = req.body.search;
    let coupons = await sql.prepared("SELECT * FROM coupons WHERE code LIKE ? LIMIT ? OFFSET ?", ["%"+search+"%", itemsPerPage, (page - 1) * itemsPerPage]);
    let count = await sql.prepared("SELECT COUNT(*) as c FROM coupons WHERE code LIKE ?", ["%"+search+"%"]);
    res.json({coupons: coupons, count: count[0].c});
});
app.post("/api/coupons/del/:id", async (req, res) => {
    await sql.prepared("DELETE FROM coupons WHERE code = ?", [req.params.id]);
    res.json({success: true});
})
app.get("/api/coupons/stats", async (req, res) => {
    let coupons = await sql.query("SELECT * FROM utilizzi_coupons ORDER BY utilizzi DESC");
    res.json(coupons);
})
//-------------------API FOR ORDERS-------------------
app.post("/api/orders", async (req, res) => {
    let itemsPerPage = req.body.itemsPerPage;
    let page = req.body.page;
    let search = req.body.search;
    let orders = await sql.prepared("SELECT * FROM ordini WHERE id LIKE ? LIMIT ? OFFSET ?", ["%"+search+"%", itemsPerPage, (page - 1) * itemsPerPage]);
    let count = await sql.prepared("SELECT COUNT(*) as c FROM ordini WHERE id LIKE ?", ["%"+search+"%"]);
    res.json({orders: orders, count: count[0].c});
});
app.post("/api/orders/del/:id", async (req, res) => {
    await sql.prepared("DELETE FROM ordini WHERE id = ?", [req.params.id]);
    res.json({success: true});
})

app.get("/api/orders/stats", async (req, res) => {
    let orders = await sql.query("SELECT * FROM fatturato_mesi");
    res.json(orders);
})
app.get("/api/orders/receipt/:id", async (req, res) => {
    let receipt = await sql.prepared("CALL sp_ricevuta(?)", [req.params.id]);
    res.json(receipt[0]);
});
app.use(express.static("app"));
app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log("Server is running on http://localhost:" + process.env.PORT);
});