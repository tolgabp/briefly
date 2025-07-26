require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

require('./models'); // connects DB & syncs models

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/** TESTING BEFORE ADDING FEATURES
 * TO CATCH BUGS EARLY
*/ 

const { User } = require('./models');

app.get('/test-create-user', async (req, res) => {
  try {
    const user = await User.create({
      email: `test${Date.now()}@example.com`,
      password_hash: 'dummyhash'
    });
    res.send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
