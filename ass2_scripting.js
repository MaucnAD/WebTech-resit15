function sortTable(n, a) {
    var table = 0, rows = 0, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    dir = "asc";

    if(a == 1) {
        table = document.getElementById("tableTwo");
    } else {
        table = document.getElementById("tableOne");
    }
    rows = table.rows;
    while(switching) {
        switching = false;

        for(i = 0; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];

            if(dir == "asc") {
                if(x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if(dir == "desc") {
                if(x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase() || Number(x.innerHTML) < Number(y.innerHTML)) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if(switchcount === 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

// function for creating the dynamic table
function createTable() {
    // getting the table data from the database
    $.ajax({
        url: "https://wt.ops.labs.vu.nl/api21/f07acf46",
        method: 'get',
        dataType: 'json',
        success: function(data) {
            // emptying the current table so that it doesn't duplicate
            $("#tableOne").empty();
            // looping through the data array
            for(var i = 0; i < data.length; i++) {
                // appending the table contents in html
                $("#tableOne").append("<tr>" + '\n' + "<td>" + data[i].product + "</td>" + '\n' +
                                      "<td>" + data[i].origin + "</td>" + '\n' +
                                      "<td>" + data[i].best_before_date + "</td>" + '\n' +
                                      "<td>" + data[i].amount + "</td>" + '\n' +
                                      "<td>" + "<img src=\"" + data[i].image + "\"" + "alt= \"Image of " + data[i].product + "\" width = \"200px\" height = \"200px\">" + "</td>" + "</tr>"
                                     );
            }
        }
    });
}

// reset button
$("#reset").click(function() {
    $.get("https://wt.ops.labs.vu.nl/api21/f07acf46/reset", "json");

    createTable();
});


// submit button
$("#poster").click(function() {
    data = {
        product: $("#product").val(),
        origin: $("#origin").val(),
        best_before_date: $("#best_before_date").val(),
        amount: $("#amount").val(),
        image: $("#image").val()
    };
    let postData = data;
    $.post("https://wt.ops.labs.vu.nl/api21/f07acf46/", postData, "json");

    createTable();
});

// load table at start
$(document).ready(function() {
    createTable();
});
