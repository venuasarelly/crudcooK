const express = require('express');
const mongoose = require('mongoose');
const app = express();
const router = express.Router();
app.use(express.json());
const path = require("path");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

mongoose.connect('mongodb+srv://venu:CHINNU@cluster0.dt57vkn.mongodb.net/?retryWrites=true&w=majority').then(
    ()=>console.log('db connected..')
).catch(err=>console.log(err))


const userRegistration = require("./router/user")
app.use("/api/user",userRegistration);

  
  app.listen(3005, () => {
    console.log('Server started on port 3000');
  });
  
  
  