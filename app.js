const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
//variables for the list added as newItem
// const url = "mongodb+srv://Rahulmongodb:Rahul777@rahulcluster.bgk9r.mongodb.net/todolistDB?retryWrites=true&w=majority";
//const url="mongodb://localhost:27017/todolistDB"
const url = "mongodb://Rahulmongodb:rahul@rahulcluster-shard-00-00.bgk9r.mongodb.net:27017,rahulcluster-shard-00-01.bgk9r.mongodb.net:27017,rahulcluster-shard-00-02.bgk9r.mongodb.net:27017/todolistDB?ssl=true&replicaSet=atlas-8vfelq-shard-0&authSource=admin&retryWrites=true&w=majority";

const con = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log( 'Database Connected' ))
     .catch(err => console.log( err ));;

if (!con) {
  console.log("database error");
}
const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "welcome to your to do list"
});

const item2 = new Item({
  name: "Hit the + buttone to add item"
});

const item3 = new Item({
  name: "<-- click here to cut the list"
});
const defaultItems = [item1, item2, item3];

// var newItems=['cook food','eat food','check food'];
var listName = [];
var workItems = [];
var studyItems = [];
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");
//date
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
//server
app.listen(process.env.PORT || 3000, function() {
  console.log("Here you go!!");
})

//home root get
app.get('/', function(req, res) {
  // console.log("hi");


  Item.find({}, function(err, newItems) {
    if (newItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("successfully saved default item to database");
        }
      });
      res.redirect('/')
    } else {
      res.render("index", {
        listName: day,
        addNewItem: newItems
      });
    }
  }).sort({
    name: -1
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
  if (req.body.list === 'work') {
    var newItem = req.body.newList;
    if (newItem != "") {
      workItems.push(newItem);
    }
    res.redirect('/work');
  }
  //study post method
  if (req.body.list === 'study') {
    var newItem = req.body.newList;
    if (newItem != "") {
      studyItems.push(newItem);
    }
    res.redirect('/study');
  }
  //root post method
  //   console.log(req.body.newList);
  //   var newItem = req.body.newList;
  //   if(newItem!=""){
  //   //newItems.push(newItem);
  //
  //   const item=new Item({
  //     name:newItem
  //   });
  //   item.save();
  // }
  //res.redirect('/');
  //customListName
  const itemName = req.body.newList;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });
  if (listName === day) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      if (!err) {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName)
      }
    });


  }


});

app.post("/delete", function(req, res) {
  console.log(req.body.checkbox);
  const checkedItemId = req.body.checkbox;
  const listNAME = req.body.listNAME;
  if (listName === day) {
    Item.findByIdAndRemove(checkedItemId, function(e) {
      if (e) {
        console.log(e);
      } else {
        console.log("deleted succesfully")
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({
      name: listNAME
    }, {
      $pull: {
        items: {
          _id: checkedItemId
        }
      }
    }, function(err, foundList) {
      if (!err) {
        res.redirect("/" + listNAME);
      }
    })
  }

})
//work item get method
app.get('/work', function(req, res) {

  res.render("index", {
    listName: 'work',
    addNewItem: workItems
  });
});
app.get('/study', function(req, res) {

  res.render("index", {
    listName: 'study',
    addNewItem: studyItems
  });
});

//dynamic route
const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);

app.get("/:customListName", function(req, res) {
  console.log(req.params.customListName);
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({
    name: customListName
  }, function(e, foundList) {
    if (!e) {
      if (!foundList) {
        console.log("doesn't exist");
        //create a new listName
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName)
      } else {
        console.log("exist");
        //show an existing list
        res.render("index", {
          listName: foundList.name,
          addNewItem: foundList.items,
        });
      }
    }
  })

})
