const sql = require('sqlite3').verbose();

class Database {
    constructor() {
        this.database = sql.Database('./db/database.db');
        this.database.run(`CREATE TABLE IF NOT EXISTS \`user\` (
                            \`id\` int(32) NOT NULL AUTO_INCREMENT,
                            \``)
    }

    InsertUser(data) {
        this.database.run(`INSERT INTO user(name, company, homelocation) VALUES(?, ?, ?, ?)`,
                            [data['name'], data['company'], data['homelocation']],
                            (err, res) => {
                                console.log("Inserted user!");
                            });
    }
}