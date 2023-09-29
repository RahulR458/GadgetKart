const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const path = require("path");

const connectDB = require('./server/database/connection')

const app = express();

dotenv.config({path :'config.env'})
const PORT = process.env.PORT || 8080

//log requests
app.use(morgan('tiny'));

//mongoDb connecton
connectDB()

//parse request to body-parser
app.use(bodyparser.urlencoded({extended:true}));

//set engin view
app.set("view engine","ejs");
app.set('views', [
    path.join(__dirname, 'views', 'user'),
    path.join(__dirname, 'views', 'admin')
]);
// app.set('views', 'views/admin')

//laod assets
app.use(express.static('public/assets'));

app.use('/',require('./server/routes/router'));

app.listen(PORT,()=>{console.log(`Server is running on http://localhost:${PORT}`)});