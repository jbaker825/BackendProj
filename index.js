const express = require('express');
const app = express();

app.use(express.json()) //for req.body
app.use(`/api`, require('./routes')) //Let's us put all our routes in one seperate file and adds /api infront of i t

app.listen(5000, () => console.log(`Port listening on 5000`));