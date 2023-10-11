// Imports
const express = require('express');

// Interfaces

// Constants
const app = express();
const PORT = 3000;

// Logic

app.listen(PORT, () => {
  console.log('Server listening on PORT ' + PORT);
});
