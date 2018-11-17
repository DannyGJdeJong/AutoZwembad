const sql = require('sqlite3').verbose();
const fs = require('fs');

class database {

    constructor(req, res) {
        this.res = res;
        this.database = new sql.Database('./db/database.db');
    }

    InitDatabase(){
        var queries = fs.readFileSync("./src/database/database.sql");
        queries = queries.toString('UTF8');
        queries = queries.split(';');
        this.database.serialize(() => {queries.forEach((x) => { this.database.run(x, (err) => {if(err) {console.log(err.message)}}); console.log(x)} )});
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
            this.res.write(JSON.stringify(rows));
            this.res.end();
        }.bind(this));
    }

    InsertUser(params) {
        var userName = params["userName"];
        var companyName = params["companyName"];
        var homeLatitude = parseFloat(params["homeLatitude"]);
        var homeLongitude = parseFloat(params["homeLongitude"]);
        var companyLatitude = parseFloat(params["companyLatitude"]);
        var companyLongitude = parseFloat(params["companyLongitude"]);

        if(!userName || !companyName || !homeLatitude || !homeLongitude){
            this.res.writeHead(400, "Bad Request, expected userId parameter");
            this.res.write("{Bad Request, expected userName, companyName, homeLatitude and homeLongitude parameters}")
            this.res.end();
            return;
        }

        var companyExists = false;

        this.database.all(
            `SELECT * 
            FROM company
            WHERE name = ${companyName}`,
            function (err, rows)  {
                if (err){
                    throw err;
                }
                if(rows.length > 0){
                    companyExists = true;
                }
            }.bind(companyExists));

        if(!companyExists && (!companyLatitude || !companyLongitude)){
            this.res.writeHead(400, "Bad Request, expected userId parameter");
            this.res.write("{Bad Request, companyLatitude and companyLongitude need to be specified when companyName doesn't exist}")
            this.res.end();
            return;
        }

        if(!companyExists && (isNaN(companyLatitude) || isNaN(companyLongitude))){
            this.res.writeHead(400, "Bad Request, expected userId parameter");
            this.res.write("{Bad Request, exptected companyLatitude and companyLongitude to be floats}")
            this.res.end();
            return;
        }

        if(isNaN(homeLatitude) || isNaN(homeLongitude)){
            this.res.writeHead(400, "Bad Request, expected userId parameter");
            this.res.write("{Bad Request, expected homeLatitude and homeLongitude to be floats}")
            this.res.end();
            return;
        }

        this.database.serialize(function(){
            if(!companyExists){
                this.database.run()
            }
        });






        this.database.run(`INSERT INTO user(name, company, homelocation) VALUES(?, ?, ?, ?)`,
            [data['name'], data['company'], data['homelocation']],
            (err, res) => {
                console.log("Inserted user!");
            });
    }
}

module.exports = database;
