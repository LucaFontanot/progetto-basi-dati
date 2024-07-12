const mysql = require("mysql2/promise");
const fs = require("fs");
module.exports = {
    connection: null,
    prepared: async function (sql, params) {
        try {
            const [rows, fields] = await this.connection.execute(sql, params);
            return rows;
        } catch (err) {
            console.error("Errore durante la query al database:", err.toString());
            return null;
        }
    },
    query: async function (sql,params=[]) {
        try {
            const [rows, fields] = await this.connection.query(sql,params);
            return rows;
        } catch (err) {
            console.error("Errore durante la query al database:", err.toString());
            return null;
        }
    },
    executeFile_o: async function (file) {
        return new Promise((resolve, reject) => {
            require("child_process").exec("mysql -h " + process.env.SQL_HOST + " -u " + process.env.SQL_USER + " -p" + process.env.SQL_PASS + " " + process.env.SQL_DATABASE + " < " + file, (error, stdout, stderr) => {
                if (error) {
                    console.error("Errore durante l'esecuzione del file:", error);
                    return resolve(null)
                }
                resolve([]);
            });
        })
    },
    executeFile: async function (file) {
        try {
            const connection_new = await mysql.createConnection({
                host: process.env.SQL_HOST,
                user: process.env.SQL_USER,
                database: process.env.SQL_DATABASE,
                port: process.env.SQL_PORT,
                password: process.env.SQL_PASS,
                multipleStatements: true
            });
            let query = fs.readFileSync(file, "utf8");
            await connection_new.query(query);
            await connection_new.end();
            return true;
        } catch (err) {
            console.error("Errore durante l'esecuzione del file:", err.toString());
            return false;
        }
    }

}
async function init(){
    try {
        console.log("Connessione al database...")
        // create the connection to database
        module.exports.connection = await mysql.createConnection({
            host: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            database: process.env.SQL_DATABASE,
            port: process.env.SQL_PORT,
            password: process.env.SQL_PASS
        });
        console.log("Connesso al database!")
    } catch (err) {
        if (err.toString().includes("Unknown database")) {
            console.error("Database non trovato, creazione in corso...")
            const tmpConnection = await mysql.createConnection({
                host: process.env.SQL_HOST,
                user: process.env.SQL_USER,
                port: process.env.SQL_PORT,
                password: process.env.SQL_PASS
            });
            await tmpConnection.query("CREATE DATABASE " + process.env.SQL_DATABASE);
            tmpConnection.end();
            console.log("Database creato!")
            return init();
        }
        console.error("Impossibile connettersi al database:" , err.toString())
        process.exit(1)
    }
}
init();
