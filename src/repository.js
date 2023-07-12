const mongo = require('mongodb');

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
  async findById(id){
    return await this.collection.findOne({_id: new mongo.ObjectId(id)})
  }
  async delete(aluno){
    await this.collection.deleteOne({_id: aluno._id});
  }
}
module.exports = AlunoRepository;
