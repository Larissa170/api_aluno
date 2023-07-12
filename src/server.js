const app = require("./app");

const porta = 3001;
app.listen(porta, () => {
  console.log(`aplicação rodando na porta ${porta}`);
});
