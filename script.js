// function for creating the dynamic table
function createTable() {
    // getting the table data from the database
    $.ajax({
        url: "https://wt.ops.labs.vu.nl/api23/12b12061",
        method: 'get',
        dataType: 'json',
        success: function(data) {
            // emptying the current table so that it doesn't duplicate
            $("#body").empty();
            // looping through the data array
            for(var i = 0; i < data.length; i++) {
                // appending the table contents in html
                $("#body").append("<tr>" + '\n' + "<td onclick=\"createTable()\">" + data[i].author + "</td>" + '\n' +
                                    "<td>" + data[i].alt + "</td>" + '\n' +
                                    "<td>" + data[i].tags + "</td>" + '\n' +
                                    "<td>" + data[i].description + "</td>" + '\n' +
                                    "<td>" + "<img src=\"" + data[i].image + "\"" + "alt= \"Image of " + data[i].product + "\" width = \"200px\" height = \"200px\">" + "</td>" + "</tr>"
                                    );
            }
        }
    });
}

// reset button
$("#reset").click(function() {
    $.get("https://wt.ops.labs.vu.nl/api23/12b12061/reset", "json");

    createTable();
});

// submit button
$("#poster").click(function() {
    data = {
        author: $("#author").val(),
        alt: $("#alt").val(),
        tags: $("#tags").val(),
        description: $("#description").val(),
        image: $("#image").val()
    };
    let postData = data;
    $.post("https://wt.ops.labs.vu.nl/api23/12b12061", postData, "json");

    createTable();
    modal.style.display = "none";
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
