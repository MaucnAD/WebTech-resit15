// CRUD functionablilty is all possible through postman and the website.
// function for creating the dynamic table
function createTable() {
    // getting the table data from the database
    fetch('http://localhost:3000/notable')
        .then((response) => response.json())
        .then((table) => {
            // emptying the current table so that it doesn't duplicate
            $("#body").empty();
            // looping through the data array
            for(var i = 0; i < table.data.length; i++) {
                // appending the table contents in html
                $("#body").append("<tr>" + '\n' + "<td>" + table.data[i].author + "</td>" + '\n' +
                                    "<td>" + table.data[i].alt + "</td>" + '\n' +
                                    "<td>" + table.data[i].tags + "</td>" + '\n' +
                                    "<td>" + table.data[i].description + "</td>" + '\n' +
                                    "<td>" + "<img src=\"" + table.data[i].image + "\"" + "alt= \"Image of " + table.data[i].author + "\" width = \"200px\" height = \"200px\">" + "</td>" + "</tr>"
                                    );
            }
        });
}

function collectData() {
    data = {
        id: $("#id").val(),
        author: $("#author").val(),
        alt: $("#alt").val(),
        tags: $("#tags").val(),
        description: $("#description").val(),
        image: $("#image").val()
    };
    return data;
}

function fetchDb(method, data) {
    switch(method) {
    case "put":
        fetch('http://localhost:3000/update-notable', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)});
    case "post":
        fetch('http://localhost:3000/notable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)});
    case "retrieve":
        var url = 'http://localhost:3000/notable/' + data.id.toString();
        fetch(url)
            .then((response) => response.json())
            .then((table) => {
                // emptying the current table so that it doesn't duplicate
                $("#body").empty();
                // looping through the data array
                    // appending the table contents in html
                    $("#body").append("<tr>" + '\n' + "<td>" + table[0].author + "</td>" + '\n' +
                                      "<td>" + table[0].alt + "</td>" + '\n' +
                                      "<td>" + table[0].tags + "</td>" + '\n' +
                                      "<td>" + table[0].description + "</td>" + '\n' +
                                      "<td>" + "<img src=\"" + table[0].image + "\"" + "alt= \"Image of " + table[0].author + "\" width = \"200px\" height = \"200px\">" + "</td>" + "</tr>"
                                     );
            });
    case "delete":
        url = 'http://localhost:3000/delete-notable/' + data.id.toString();
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)});
    }
}

function create(method) {
    let data = collectData();
    fetchDb(method, data);
    if(method != "retrieve") createTable();
    modal.style.display = "none";
}

// submit/update button
$("#submit").click(function() {
    create("post");
});

$("#reload").click(function() {
    createTable();
});

$("#update").click(function() {
    create("put");
});

$("#retrieve").click(function() {
    create("retrieve");
});

$("#delete").click(function() {
    create("delete");
});

// load table at start
$(document).ready(function() {
    createTable();
});

// modal is obtained from w3schools.
var modal = document.getElementById("myModal");
$("#modal").click(function() {
    modal.style.display = "block";
});

$(window).click(function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

//https://wt.ops.labs.vu.nl/api23/12b12061
//http://localhost:3000/products
