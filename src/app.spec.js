const app = require("./app");
const Container = require("./container");
const request = require("supertest")(app);

describe("API de CRUD Alunos", () => {
  let repository;
  let client;
  // conexao que será usada em tods os testes
  beforeAll(async () => {
    const container = new Container();
    client = container.getClient();
    repository = await container.getRepository();
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
      idade: 15,
    });

    const response = await request
      .get("/alunos")
      .expect("Content-type", /application\/json/);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);

    expect(response.body[0]).toStrictEqual(
      expect.objectContaining({
        nome: "Laura",
        idade: 15,
      })
    );
  });

  test("POST /alunos", async () => {
    const aluno = {
      nome: "Laura",
      idade: 20,
    };

    const response = await request.post("/alunos").send(aluno);

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual(expect.objectContaining(aluno));
  });

  describe("GET /alunos/:id", () => {
    test("deve retornar 200 para um aluno existente", async () => {
      const aluno = await repository.create({
        nome: "Lucas",
        idade: 11,
      });

      const response = await request
        .get(`/alunos/${aluno._id}`)
        .expect("Content-type", /application\/json/);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          nome: "Lucas",
          idade: 11,
        })
      );
    });

    test("deve retornar 404 para aluno nao existente", async () => {
      const response = await request
        .get(`/alunos/64aefbdb1b0aba3d5e1fec4c`)
        .expect("Content-type", /application\/json/);
      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({
        status: 404,
        error: "Aluno não encontrado",
      });
    });
  });
  describe("PUT /alunos/:id", () => {
    test("Deve retornar 200 para um aluno existente", async () => {
      const aluno = await repository.create({
        nome: "Luna",
        idade: 12,
      });

      const response = await request
        .put(`/alunos/${aluno._id}`)
        .send({
          nome: "Luna",
          idade: 20,
        })
        .expect("Content-type", /application\/json/);
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          nome: "Luna",
          idade: 20,
        })
      );
      const newAluno = await repository.findById(aluno._id);
      expect(newAluno).toStrictEqual(
        expect.objectContaining({
          nome: "Luna",
          idade: 20,
        })
      );
    });

    test("Deve retornar 404 para um aluno inexistente", async () => {
      const response = await request
        .put("/alunos/64aefbdb1b0aba3d5e1fec4c")
        .send({
          nome: "Laura",
          idade: 15,
        })
        .expect("Content-type", /application\/json/);

      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({
        status: 404,
        error: "Aluno não encontrado",
      });
    });
  });
  describe("DELETE /alunos/:id", () => {
    test("Deve retornar 204 para aluno existente", async () => {
      const aluno = await repository.create({
        nome: "Luna",
        idade: 12,
      });

      const response = await request.delete(`/alunos/${aluno._id}`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toStrictEqual({});
      const newAluno = await repository.findById(aluno._id);
      expect(newAluno).toBe(null);
    });
    test("Deve retornar 404 para aluno inexistente", async () => {
      const response = await request
        .delete("/alunos/64aefbdb1b0aba3d5e1fec4c")
        .expect("Content-type", /application\/json/);

      expect(response.statusCode).toBe(404);
      expect(response.body).toStrictEqual({
        status: 404,
        error: "Aluno não encontrado",
      });
    });
  });
});
