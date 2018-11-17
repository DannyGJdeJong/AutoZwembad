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

        this.res.write(JSON.stringify(params));

        console.log(JSON.stringify(params));
        console.log(homeLatitude);
        console.log(homeLongitude);

        if(!userName || !companyName || !homeLatitude || !homeLongitude){
            //this.res.writeHead(400, "Bad Request, expected userId parameter");
            this.res.write("{Bad Request, expected userName, companyName, homeLatitude and homeLongitude parameters}")
            this.res.end();
            return;
        }

        var companyId;

        this.database.all(
            `SELECT * 
            FROM company
            WHERE name = "${companyName}"`,
            (err, rows) => {
                if (err){
                    throw err;
                }
                if(rows.length > 0){
                    companyId = rows[0]["id"];
                }
            });

        if(!companyId && (!companyLatitude || !companyLongitude)){
            this.res.writeHead(400, "Bad Request, expected userId parameter");
            this.res.write("{Bad Request, companyLatitude and companyLongitude need to be specified when companyName doesn't exist}")
            this.res.end();
            return;
        }

        if(!companyId && (isNaN(companyLatitude) || isNaN(companyLongitude))){
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

        this.database.serialize(() => {
            if(!companyId){
                var locationId;
                this.database.run(`
                    INSERT INTO location (latitude, longitude)
                    VALUES (${companyLatitude}, ${companyLongitude})
                `)
                this.database.all(`
                    SELECT id
                    FROM location
                    WHERE latitude = ${companyLatitude} AND longitude = ${companyLongitude}
                `,
                (err, rows) => {
                    if (err){
                        throw err;
                    }
                    if(rows.length > 0){
                        locationId = rows[0]["id"];
                    }
                });
                this.database.run(`
                    INSERT INTO company (name, location)
                    VALUES ("${companyName}", ${locationId})
                `);
                this.database.all(`
                    SELECT id
                    FROM company
                    WHERE name = "${companyName}" AND location = ${locationId}
                `,
                (err, rows) => {
                    if (err){
                        throw err;
                    }
                    if(rows.length > 0){
                        companyId = rows[0]["id"];
                        console.log(companyId);
                    }
                });


                console.log(companyId, locationId);
            }
        });






        /*this.database.run(`INSERT INTO user(name, company, homelocation) VALUES(?, ?, ?, ?)`,
            [data['name'], data['company'], data['homelocation']],
            (err, res) => {
                console.log("Inserted user!");
            });*/
    }
}

module.exports = database;
