const express = require("express");
//const { MongoClient } = require("mongodb");


const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://Rahulmongodb:rahul@rahulcluster.bgk9r.mongodb.net?retryWrites=true&w=majority";
const uri = "mongodb://Rahulmongodb:rahul@rahulcluster-shard-00-00.bgk9r.mongodb.net:27017,rahulcluster-shard-00-01.bgk9r.mongodb.net:27017,rahulcluster-shard-00-02.bgk9r.mongodb.net:27017/test?ssl=true&replicaSet=atlas-8vfelq-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("fruits");
  // perform actions on the collection object
//console.log("error");
  if(!client){
    console.log("client error");
  }else{
    console.log("client connected");
  }
  async function run() {
  try {
const con=  await client.connect();
if(!con){
  console.log("database error");
}else{
  console.log("database connected");
}

    const database = client.db('test');
    const movies = database.collection('fruits');
    // Query for a movie that has the title 'Back to the Future'
    const query = { name: 'mango' };
    const movie = await movies.findOne(query);
    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
