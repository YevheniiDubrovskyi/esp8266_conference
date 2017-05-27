const config = require('config');
const app = require('./app');

const port = config.get('port');

app.listen(port, (err) => {
  if (err) console.erro(err);

  console.log(`JSON server deployed on port ${ port }`);
});