const express = require('express');
const app = express();
const port = 3000;
const flashCardRoutes = require('./routes/flash');
// nécessaire pour faire des appels
const cors = require("cors");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// attention à déclaréer après les méthodes .json et urlencoded
app.use('/api/v1/flash-cards', flashCardRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
