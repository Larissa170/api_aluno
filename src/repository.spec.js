const AlunoRepository = require("./repository");
const { MongoClient } = require("mongodb");

describe("AlunoRepository", () => {

  let client ;
  let repository;

  beforeAll(async() => {
    const dsn = "mongodb://root:root@localhost?retryWrites=true&writeConcern=majority";
    client = new MongoClient(dsn);
    await client.connect();
    const collection = client.db("ap_db").collection("alunos");
    repository = new AlunoRepository(collection);
  });

  afterAll(async() => {
    await client.close();
  });

  beforeEach(async() => {
    await repository.deleteAll();
  });

  test("Repositorio deve criar um novo aluno", async () => {    
    
    const result = await repository.create({
      nome: "Jose",
      idade: 20,
    });
   
    expect(result).toStrictEqual(expect.objectContaining({
        nome: "Jose",
        idade: 20,
      }));
   
    const alunos = await repository.findAll();
    expect(alunos.length).toBe(1);
  });
});
