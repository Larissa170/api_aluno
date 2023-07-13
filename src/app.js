const express = require("express");
const AlunoRepository = require("./repository");
const Container = require("./container");

const app = express();
app.use(express.json());

app.set("container", new Container());

app.get("/alunos", async (request, response) => {
  const repository = await app.get("container").getRepository();

  const alunos = await repository.findAll();

  response.json(alunos);
});

app.post("/alunos", async (request, response) => {
  const repository = await app.get("container").getRepository();
  try {
    const aluno = await repository.create(request.body);
    response.status(201).json(aluno);
  } catch (e) {
    response.status(500).json({ error: e.message });
  }
});
app.get("/alunos/:id", async (request, response) => {
  const repository = await app.get("container").getRepository();
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
});

app.put("/alunos/:id", async (request, response) => {
  const repository = await app.get("container").getRepository();
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
});
app.delete("/alunos/:id", async (request, response) => {
  const repository = await app.get("container").getRepository();
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
});
module.exports = app;
