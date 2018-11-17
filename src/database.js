const sql = require('sqlite3').verbose();
const fs = require('fs');

class database {

    constructor(req, res) {
        this.res = res;
        this.database = new sql.Database('./db/database.db');
        var queries = fs.readFileSync("./src/database/database.sql");
        console.log("Created the database")
        queries = queries.toString('UTF8');
        queries = queries.split(';');
        this.database.serialize(() => {queries.forEach((x) => { this.database.run(x, (err) => {if(err) {console.log(err.message)}}); console.log(x)} )});
        //this.database.run(queries.toString('UTF8'));
        //this.database.close();

        this.database.each(`SELECT * FROM user`, (err, row) => {
            if (err){
              throw err;
            }
            console.log(row.id);
          });
        console.log("Closed the database")
    }

    GetUser(params){
        var userId = params["userId"];
        if(!userId){
            this.res.writeHead(400, "Bad Request, expected userId parameter");
            this.res.write("{Bad Request, expected userId parameter}")
            this.res.end();
            return;
        }

        var query = `
        SELECT u.id as userId, u.name as UserName, c.name as CompanyName, l.longitude as CompLongitude, l.latitude as CompLatitude, l2.longitude as UserLongitude, l2.latitude as UserLatitude
        FROM user u
        JOIN company c ON c.id = u.company_id
        JOIN location l ON l.id = c.location
        JOIN location l2 ON l2.id = u.homelocation `;

        if (userId &&  /^\d+$/.test(userId)){
            query += `WHERE u.id = ${userId}`;
        }

        this.database.all(query ,function (err, rows)  {
            if (err){
                throw err;
            }
            console.log(this)
            rows.forEach((row) => {
                this.res.write(JSON.stringify(row));
              });
            this.res.end();
        }.bind(this));
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
