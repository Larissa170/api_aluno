const express = require("express");
const { MongoClient } = require("mongodb");
const AlunoRepository = require("./repository");

const app = express();
app.use(express.json());
const dsn =
  "mongodb://root:root@localhost?retryWrites=true&writeConcern=majority";
const client = new MongoClient(dsn);

app.get("/alunos", async (request, response) => {
  await client.connect();
  const collection = client.db("ap_db").collection("alunos");
  const repository = new AlunoRepository(collection);

  const alunos = await repository.findAll();
  await client.close();

  response.json(alunos);
});

app.post("/alunos", async (request, response) => {
  await client.connect();
  const collection = client.db("ap_db").collection("alunos");
  const repository = new AlunoRepository(collection);

  try {
    const aluno = await repository.create(request.body);
    response.status(201).json(aluno);
  } catch (e) {
    response.status(500).json({ error: e.message });
  }

  await client.close();
});
app.get("/alunos/:id", async (request, response) => {
  await client.connect();
  const collection = client.db("ap_db").collection("alunos");
  const repository = new AlunoRepository(collection);
  try {
    const aluno = await repository.findById(request.params.id);
    if (aluno === null) {
      response.status(404).json({
        status: 404,
        error: "Aluno não encontrado",
      });
    } else {
      response.json(aluno);
    }
  } catch (e) {
    console.log(e);
    response.status(500).json({ error: e.message });
  }
  await client.close();
});

app.put("/alunos/:id", async (request, response) => {
  await client.connect();
  const collection = client.db("ap_db").collection("alunos");
  const repository = new AlunoRepository(collection);
  const aluno = await repository.findById(request.params.id);
  if (aluno === null) {
    response.status(404).json({
      status: 404,
      error: "Aluno não encontrado",
    });
  } else {
    const newAluno = { ...aluno, ...request.body };
    await repository.update(newAluno);
    response.json(newAluno);
  }

  await client.close();
});
app.delete("/alunos/:id", async (request, response) => {
  await client.connect();
  const collection = client.db("ap_db").collection("alunos");
  const repository = new AlunoRepository(collection);
  const aluno = await repository.findById(request.params.id);

  if (null !== aluno) {
    await repository.delete(aluno);
    response.status(204).send();
  } else {
    response.status(404).json({
      status: 404,
      error: "Aluno não encontrado",
    });
  }

  await client.close();
});
module.exports = app;
