const express = require("express");
const ConnectionDatabase = require("./db/connect.db");
const UserRoutes = require("./routes/user.route")
const UploadRoutes = require("./routes/upload.route")
require('dotenv').config()
const cors = require('cors')

const app = express();
app.use(express.json());

ConnectionDatabase()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'exp://192.168.1.133:8081');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/welcome', (req, res) => {
  res.send('Welcome! get a baby sitter of your dream.');
});
app.use(cors())
app.use('/api',cors(), UserRoutes)
app.use('/api', UploadRoutes);

app.listen(3001, () => {
  console.log("server is running");
});