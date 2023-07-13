const { MongoClient } = require("mongodb");
const AlunoRepository = require("./repository");

class Container {
  services = {};

  getClient() {
    //se cliente ja existe retorna ele se nao cria outro
    if (this.services.client !== undefined) {
      return this.services.client;
    }
    const dns =
      "mongodb://root:root@localhost?retryWrites=true&writeConcern=majority";
    const client = new MongoClient(dns);
    return (this.services.client = client);
  }

  async getRepository() {
    if (this.services.repository !== undefined) {
      return this.services.repository;
    }
    const client = this.getClient();
    await client.connect();
    const collection = client.db("ap_db").collection("alunos");

    return (this.services.repository = new AlunoRepository(collection));
  }
}
module.exports = Container;
