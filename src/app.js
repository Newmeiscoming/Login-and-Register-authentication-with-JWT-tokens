const express = require("express");
const Connection = require("../connection/dbconnect")
const app = express();
const port = 8080;
const URL = "mongodb://localhost:27017/usedata"
const routes = require("../routes/userRoutes");
app.use(express.json());

app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
})

app.use(routes);
Connection(URL)
