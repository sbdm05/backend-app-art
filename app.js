const express = require('express');
const app = express();

const flashCardRoutes = require('./routes/flash');
// nécessaire pour faire des appels
const cors = require("cors");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// parse application/json

app.use(cors());

// attention à déclaréer après les méthodes .json et urlencoded
app.use('/api/v1/flash-cards', flashCardRoutes);

// adresse à utiliser en local =>  localhost:4000
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
