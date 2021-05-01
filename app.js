//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
//variables for the list added as newItem
var newItems=['cook food','eat food','check food'];
var listName=[];
var workItems=[];
var studyItems=[];
app.use(bodyParser.urlencoded({
  extension: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

//server
app.listen(process.env.PORT||3000, function() {
  // console.log("Here you go!!");
})

//home root get
app.get('/', function(req, res) {
  // console.log("hi");

  let today = new Date();

  let currentDay = today.getDay();
  // console.log(currentDay);
  // let day = "";
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
   }
  let day = today.toLocaleDateString("en-UN", options);
  res.render("index", {
    listName: day,
    addNewItem:newItems
  });
  // if (currentDay === 6 || currentDay === 0) {
  //   day = "weekend"
  //   res.render("index", {
  //     dayname: day
  //   });
  // } else {
  //   day = "weekday"
  //   res.render("index", {
  //     dayname: day
  //   });
  //
  // }
  // switch (currentDay) {
  //   case 1:
  //     day = "monday";
  //     break;
  //   case 2:
  //     day = "tuesday";
  //     break;
  //   case 3:
  //     day = "wednesday";
  //     break;
  //   case 4:
  //     day = "thursday";
  //     break;
  //   case 5:
  //     day = "friday";
  //     break;
  //   case 6:
  //     day = "saturday";
  //     break;
  //   case 0:
  //     day = "sunday";
  //     break;
  //
  // }
  // res.render("index", {
  //   dayname: day
  // });
  // res.sendFile(__dirname+"/index.html");

});
//home root post
app.post('/', function(req, res) {
  //work item post method
  if(req.body.list==='work'){
    var newItem = req.body.newList;
  if(newItem!=""){
  workItems.push(newItem);
  }
  res.redirect('/work');
  }
  //study post method
  if(req.body.list==='study'){
    var newItem = req.body.newList;
  if(newItem!=""){
  studyItems.push(newItem);
  }
  res.redirect('/study');
  }
  //root post method
  console.log(req.body.newList);
  var newItem = req.body.newList;
  if(newItem!=""){
  newItems.push(newItem);
}
  res.redirect('/');
});
//work item get method
app.get('/work',function(req,res){

  res.render("index",{listName:'work',addNewItem:workItems});
});
app.get('/study',function(req,res){

  res.render("index",{listName:'study',addNewItem:studyItems});
});
