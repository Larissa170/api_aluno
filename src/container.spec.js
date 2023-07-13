const Container = require("./container");
describe("Container", () => {
  let container;
  beforeEach(() => {
    container = new Container();
  });
  test("Deve criar um cliente mongo", () => {
    const client = container.getClient();
    expect(client).not.toBe(null);
    expect(client).not.toBe(undefined);
  });
  test("Deve retornar sempre a mesma instancia", () => {
    const clientA = container.getClient();
    const clientB = container.getClient();
    expect(clientA).toStrictEqual(clientB);
  });

  test("DEve criar um repositorio de alunos", async () => {
    const repository = container.getRepository();
    expect(repository).not.toBe(null);
    expect(repository).not.toBe(undefined);
  });
});
