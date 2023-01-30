//I did part of the bonus, the data from the table is from our own database
//and the submit button also submits to our own database. We unfortunately didn't
//figure out how to use the other functions(from our own page). It is also no longer buggy when using our
//own database, meaning that the fact that it worked like 50% of the time in assigment #2
//was a database problem with the database provided by school.

const sqlite = require('sqlite3').verbose();
let db = my_database('./notable.db');

// First, create an express application `app`:
var express = require("express");
var cors = require("cors");
var app = express();

// Use cors
app.use(cors());

// We need some middleware to parse JSON data in the body of our HTTP requests:
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

function errorMessage(err, res) {
    res.status(err.status).json({
        "error": res.message
    });
}

// ###############################################################################
// All GET functions here

function search(res, params) {
    if(params != null) {
        db.all(`SELECT * FROM notable WHERE id=?`, [params.id], function(err, rows) {
            if (err) errorMessage(err, res);
            res.json(rows);
        });
    }
}

// Get list of 1 product in the database
app.get('/notable/:id', function(req, res) {
    search(res, req.params);
});

// Get list of all products in the database
app.get('/notable', function(req, res) {
    db.all(`SELECT * FROM notable`, function(err, rows) {

        if (err) errorMessage(err, res);
        res.json({
            "data": rows
        });
    });
});


// ###############################################################################
// All POST functions here

app.post('/notable', function(req, res) {
    var data = {
        author: req.body.author,
        alt: req.body.alt,
        tags: req.body.tags,
        description: req.body.description,
        image: req.body.image
    };
    var params = [data.author, data.alt, data['tags'], data.description, data.image];
    db.run(`INSERT INTO notable (author, alt, tags, description, image) VALUES (?, ?, ?, ?, ?)`, [data.author, data.alt, data.tags, data.description, data.image], function(err, params) {
        if (err) {
            return console.error(err.status + err.message);
        }
        return req.json;
    });
});


// ###############################################################################
// All UPDATE (PUT) functions here

app.put("/update-notable", function(req, res) {
    var data = {
        id: req.body.id,
        author: req.body.author,
        alt: req.body.alt,
        tags: req.body.tags,
        description: req.body.description,
        image: req.body.image
    };
    db.run(
        `UPDATE notable SET
           author = COALESCE(?, author),
           alt = COALESCE(?, alt),
           tags = COALESCE(?, tags),
           description = COALESCE(?, description),
           image = COALESCE(?, image)
           WHERE id = ?`, [data.author, data.alt, data.tags, data.description, data.image, data.id],
        function(err) {
            if (err) errorMessage(err, res);
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            });
            return res.json;
        });
});


// ###############################################################################
// All DELETE functions here

app.delete("/delete-notable/:id", function(req, res) {
    db.run(
        'DELETE FROM notable WHERE id = ?',
        req.params.id,
        function(err) {
            if (err) errorMessage(err, res);
            res.json({
                "message": "deleted",
            });
        });
});

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
        console.log('Connected to the notable database.');
    });
    // Create our products table if it does not exist already:
    db.serialize(() => {
        db.run(`
        	CREATE TABLE IF NOT EXISTS notable
        	(id 	  INTEGER PRIMARY KEY,
        	author	CHAR(100) NOT NULL,
        	alt 	CHAR(100) NOT NULL,
        	tags 	CHAR(20) NOT NULL,
          description  CHAR(2000) NOT NULL,
        	image   CHAR(254) NOT NULL
        	)`);
        db.all(`select count(*) as count from notable`, function(err, result) {
            if (result[0].count == 0) {
                db.run(`INSERT INTO notable (author, alt, tags, description, image) VALUES (?, ?, ?, ?, ?)`, ["Grace Hopper", "Image of Grace Hopper at the UNIVAC I console", "programming, linking, navy", "Grace was very curious as a child; this was a lifelong trait. At the age of seven, she decided to determine how an alarm clock worked and dismantled seven alarm clocks before her mother realized what she was doing (she was then limited to one clock)", "https://upload.wikimedia.org/wikipedia/commons/3/37/Grace_Hopper_and_UNIVAC.jpg"]);
                console.log('Inserted dummy Grace entry into empty notable database');
            } else {
                console.log("Database already contains", result[0].count, " item(s) at startup.");
            }
        });
    });
    return db;
}
