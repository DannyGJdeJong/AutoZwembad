const sql = require('sqlite3').verbose();
const fs = require('fs');

class database {

    constructor() {
        this.database = new sql.Database('./db/database.db');
        var queries = fs.readFileSync("./src/database/database.sql");
        console.log("Created the database")
        queries = queries.toString('UTF8');
        queries = queries.split(';');
        queries.forEach((x) => { this.database.run(x); console.log(x)} );
        //this.database.run(queries.toString('UTF8'));
        //this.database.close();
        console.log("Closed the database")
    }

    inserttestdata(){
        this.database.run();
    }

    InsertUser(data) {
        this.database.run(`INSERT INTO user(name, company, homelocation) VALUES(?, ?, ?, ?)`,
                            [data['name'], data['company'], data['homelocation']],
                            (err, res) => {
                                console.log("Inserted user!");
                            });
    }
}
module.exports = database;
