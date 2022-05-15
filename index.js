const express = require ('express');
const { transfer } = require('./transfer');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json())
const PORT = 3000;

app.post('/', transfer);

app.listen(PORT, () => {
    console.log("Application is listening on port:", PORT);
});