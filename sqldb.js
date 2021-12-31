var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database : "rahul",
  password: "password2",

});
//console.log(con);
con.connect(function(err) {
  if (err) throw err.stack;
  console.log("Connected!");
});
con.query("SELECT * FROM lists", function (error, results, fields) {
  if (error) throw error;
  // connected!
  results.forEach(results => console.log(result));

});
