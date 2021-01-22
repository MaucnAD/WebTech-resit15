const sqlite = require('sqlite3').verbose();
let db = my_database('./products.db');

// First, create an express application `app`:
var express = require("express");
var app = express();

// We need some middleware to parse JSON data in the body of our HTTP requests:
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// ###############################################################################
// All GET functions here

// Get list of 1 product in the database
app.get('/productspecific', function(req, res) {
    db.get(`SELECT * FROM products WHERE product=?`, [req.body.product], function(err, row) {

        if (err) {
            res.status(err.status).json({
                "error": err.message
            });
            return;
        }
        return res.json(row);
    });
});

// Get list of all products in the database
app.get('/products', function(req, res) {
    db.all(`SELECT * FROM products`, function(err, rows) {

        if (err) {
            res.status(err.status).json({
                "error": err.message
            });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});


// ###############################################################################
// All POST functions here

app.post('/products', function(req, res) {
    var data = {
        product: req.body.product,
        origin: req.body.origin,
        best_before_date: req.body.best_before_date,
        amount: req.body.amount,
        image: req.body.image
    };
    var params = [data.product, data.origin, data['best_before_date'], data.amount, data.image];
    db.run(`INSERT INTO products (product, origin, best_before_date, amount, image) VALUES (?, ?, ?, ?, ?)`, params, function(err) {
        if (err) {
            return console.error(err.status + err.message);
        }
    });
    console.log(req.body);
    return res.json(req.body);
});


// ###############################################################################
// All UPDATE (PUT) functions here

app.put("/productupdate", function(req, res) {
    var data = {
        id: req.body.id,
        product: req.body.product,
        origin: req.body.origin,
        best_before_date: req.body.best_before_date,
        amount: req.body.amount,
        image: req.body.image
    };
    db.run(
        `UPDATE products set 
           product = COALESCE(?, product), 
           origin = COALESCE(?, origin), 
		   best_before_date = COALESCE(?, best_before_date),
		   amount = COALESCE(?, amount),
		   image = COALESCE(?, image) 
           WHERE id = ?`, [data.product, data.origin, data['best_before_date'], data.amount, data.image, data.id],
        function(err, result) {
            if (err) {
                res.status(err.status).json({
                    "error": res.message
                })
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
        });
})


// ###############################################################################
// All DELETE functions here

app.delete("/productdelete", function(req, res) {
    db.run(
        'DELETE FROM products WHERE id = ?',
        req.body.id,
        function(err, result) {
            if (err) {
                res.status(err.status).json({
                    "error": res.message
                })
                return;
            }
            res.json({
                "message": "deleted",
                changes: this.changes
            })
        });
})


// ###############################################################################
// This should start the server, after the routes have been defined, at port 3000:

app.listen(3000);


// ###############################################################################
// Some helper functions called above
function my_database(filename) {
    // Connect to db by opening filename, create filename if it does not exist:
    var db = new sqlite.Database(filename, (err) => {
        if (err) {
            console.error(err.status + err.message);
        }
        console.log('Connected to the products database.');
    });
    // Create our products table if it does not exist already:
    db.serialize(() => {
        db.run(`
        	CREATE TABLE IF NOT EXISTS products
        	(id 	  INTEGER PRIMARY KEY,
        	product	CHAR(100) NOT NULL,
        	origin 	CHAR(100) NOT NULL,
        	best_before_date 	CHAR(20) NOT NULL,
            amount  CHAR(20) NOT NULL,
        	image   CHAR(254) NOT NULL
        	)`);
        db.all(`select count(*) as count from products`, function(err, result) {
            if (result[0].count == 0) {
                db.run(`INSERT INTO products (product, origin, best_before_date, amount, image) VALUES (?, ?, ?, ?, ?)`, ["Apples", "The Netherlands", "November 2019", "100kg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Apples.jpg/512px-Apples.jpg"]);
                console.log('Inserted dummy Apples entry into empty product database');
            } else {
                console.log("Database already contains", result[0].count, " item(s) at startup.");
            }
        });
    });
    return db;
}