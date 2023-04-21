const express = require('express');
const app = express();
const port = 3000;
const flashCardRoutes = require('./routes/flash');

app.use('/api/v1/flash-cards', flashCardRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
