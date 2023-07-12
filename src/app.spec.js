const app = require("./app");

const request = require("supertest")(app);
const AlunoRepository = require("./repository");
const { MongoClient } = require("mongodb");

describe("API de CRUD Alunos", () => {
  let repository;
  let client;
  // conexao que será usada em tods os testes
  beforeAll(async () => {
    const dsn =
      "mongodb://root:root@localhost?retryWrites=true&writeConcern=majority";
    client = new MongoClient(dsn);
    await client.connect();
    const collection = client.db("ap_db").collection("alunos");
    repository = new AlunoRepository(collection);
  });
  afterAll(async () => {
    await client.close();
  });

  beforeEach(async () => {
    await repository.deleteAll();
  });

  test("GET /alunos", async () => {
    await repository.create({
      nome: "Laura",
      idade: 15
    });

    const response = await request.get("/alunos").expect("Content-type", /application\/json/);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toStrictEqual(
      expect.objectContaining({
        nome: "Laura",
        idade: 15
      })    
    );
  });
  test.todo("POST /alunos");

  test.todo("GET /alunos/;id");
  test.todo("PUT /alunos/:id");
  test.todo("DELETE /alunos/:id");
});
