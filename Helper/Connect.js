var mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "instakhil",
  password: "akhil2812",
  database: "instaphantomDB",
});

const DbConection = () => {
  con.connect(function (err) {
    if (err) console.log(err);
    console.log("Connected!");
  });
};

module.exports = {DbConection, con}