var mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "instaphantom",
});

const DbConection = () => {
  con.connect(function (err) {
    if (err) console.log(err);
    console.log("Connected!");
  });
};

module.exports = {DbConection, con}