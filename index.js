const express = require("express");
const ConnectionDatabase = require("./db/connect.db");
const UserRoutes = require("./routes/user.route")
const UploadRoutes = require("./routes/upload.route")
require('dotenv').config()

const app = express();
app.use(express.json());

ConnectionDatabase()

app.get('/', (req, res) => {
  res.send('Welcome! get a baby sitter of your dream.');
});

app.use('/api', UserRoutes)
app.use('/api', UploadRoutes);

app.listen(3001, () => {
  console.log("server is running");
});