var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "Bamazon"
})

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
})

var inquiry = function () {

connection.query('SELECT * FROM products', function (err, res, field) {

    if (err) throw err;
    console.log(res);
});

    inquirer.prompt([{
        name: "ID",
        message: "What product ID do you want to buy?"
    }, {
        name: "quantity",
        message: "How many would you like to buy?"
    }]).then(function (answers) {

        var productID = answers.ID;
        var productStock = answers.quantity;

        connection.query('SELECT stockQuantity FROM products WHERE ?', { itemID: productID }, function (err, res, field) {

            var currentStock = res[0].stockQuantity;

            if (err) throw err;

            if (productStock > currentStock) {
                console.log("Sorry, out of stock!");
                console.log("We currently only have " + currentStock + " in stock");
            } else {
                console.log("In stock!");
                console.log("Currently we have " + currentStock + " in stock");
                var newStock = currentStock - productStock

                updateStock(newStock, productID);
            }
        })
    });
}

var updateStock = function (newStock, productID) {

    connection.query('UPDATE products SET ? WHERE ?', [{ stockQuantity: newStock }, { itemID: productID }], function (err, res, field) {
        connection.query('SELECT stockQuantity FROM products WHERE ?', { itemID: productID }, function (err, res) {
            if (err) throw err;
            console.log("...................................")
            console.log("Purchased!");
            console.log("We now have  " + res[0].stockQuantity + " left in stock");
        })
        connection.query('SELECT price FROM products WHERE ?', { itemID: productID }, function (err, res) {
            if (err) throw err;
            console.log("...................................")
            console.log("Your total cost is " + res[0].price);
        })        
    })

}

inquiry();