var XLSX = require('xlsx');
var assert = require('assert');
var SheetJSSQL = require('./SheetJSSQL');
var mysql2 = require('mysql2/promise');
var mysql = require('mysql');  
 var opts = {
        host: 'localhost',
        user: 'gaam',
		password: 'gaam@1234',
		database: 'mydb'
    };
exports.upload_timetable = function () {
 
    (async () => {
        const conn2 = await mysql2.createConnection(Object.assign({}, opts));
        var wb2 = XLSX.readFile("MathClasse.xlsx");
        var queries = SheetJSSQL.book_to_sql(wb2, "MYSQL");

        for (i = 0; i < queries.length; ++i) {
             console.log(">>> "+queries[i]);
            try {
               await conn2.query(queries[i]);
            }
            catch (err) {
                console.log('ERR>' + err)
            }

        }
    })();
}
const fs = require('fs');
const csv = require('fast-csv');
let stream = fs.createReadStream('user.csv');
let generator = require('generate-password');
let myData = [];
exports.upload_user = function () {
	let csvStream = csv
	.parse()
	.on("data", function (data) {
		pass = generator.generate({
			length: 10,
			numbers: true
		});
		myData.push(data);
		console.log(data);
		console.log(data + pass);
	})
	.on("end", function () {
		//myData.shift();

		// create a new connection to the database
		const connection = mysql.createConnection(opts);

		// open the connection
		connection.connect((error) => {
			if (error) {
				console.error(error);
			} else {
				let query = 'INSERT INTO users (email) VALUES ?';
				//console.log([myData].toString().replace('],');
				connection.query(query, [myData], (error, response) => {
					console.log(error || response);

				});
				
				connection.query('UPDATE mydb.users SET password = (SELECT SUBSTRING(MD5(RAND()) FROM 1 FOR 6 )) WHERE password is null;')
				//const today = new Date()
				//console.log(today.toDateString())
				//connection.query('UPDATE mydb.users SET created = '+ new Date().toDateString() + ' WHERE created is null;')
				connection.query('SELECT * from users', function(err, rows, fields){
					if (err)
					{
						console.log("Querying error");
					}
					else
					{
						console.log(rows);
					}
					connection.end();
				});
		
			};
		}


		);
	});

stream.pipe(csvStream);
}