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

  test("Repositório deve listar todos os alunos", async () => {
    await repository.create({
      nome:"João",
      idade:25
    });

    const result = await repository.findAll();

    expect(result[0]).toStrictEqual(expect.objectContaining({
      nome:"João",
      idade:25
    }))
  });

  test("Repositório deve atualizar um aluno", async () => {
    const aluno = await repository.create({
      nome:"Jonas",
      idade:15
    });
    aluno.idade = 18;
    await repository.update(aluno);

    const result = await repository.findById(aluno._id);
    expect(result).toStrictEqual(expect.objectContaining({
      nome:"Jonas",
      idade:18
    }));
  });

  test("Repositorio deve remover um aluno", async () => {
    const aluno = await repository.create({
      nome:"Jonas",
      idade:15
    });

    await repository.delete(aluno);

    const alunos = await repository.findAll();
    expect(alunos.length).toBe(0);
  });

});
