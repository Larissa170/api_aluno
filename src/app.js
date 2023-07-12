const express = require("express");
const { MongoClient } = require("mongodb");
const AlunoRepository = require("./repository");

const app = express();
const dsn = "mongodb://root:root@localhost?retryWrites=true&writeConcern=majority";
const client = new MongoClient(dsn);


app.get("/alunos", async (request, response) => {
  await client.connect();
  const collection = client.db("ap_db").collection("alunos");
  const repository = new AlunoRepository(collection); 

  const alunos = await repository.findAll();
  await client.close();

  response.json(alunos);
});

module.exports = app;
