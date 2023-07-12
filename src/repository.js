class AlunoRepository {
  collection;
  constructor(collection) {
    this.collection = collection;
  }
  async deleteAll(){    
    await this.collection.deleteMany({});
  }
  async create(aluno) {
    await this.collection.insertOne(aluno);
    return aluno;
  }
  async findAll() {
    return (await this.collection.find({})).toArray();    
  }
  async update(aluno){
    await this.collection.updateOne({_id: aluno._id},{$set: aluno});
  }
}
module.exports = AlunoRepository;
