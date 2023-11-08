const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const path = require("path");
const session = require('express-session');
const cookiesParser = require("cookie-parser")

const connectDB = require('./server/database/connection')
const userRouter = require('./server/routes/userRouter')
const adminRouter = require('./server/routes/adminRouter')

const app = express();

dotenv.config({path :'config.env'})
const PORT = process.env.PORT || 8080

app.use(cookiesParser())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

//log requests
app.use(morgan('tiny'));

//mongoDb connecton
connectDB()

//parse request to body-parser
app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}));

//set engin view
app.set("view engine","ejs");
app.set('views', [
    path.join(__dirname, 'views', 'user'),
    path.join(__dirname, 'views', 'admin')
]);
// app.set('views', 'views/admin')

//load assets
app.use(express.static('public'));
userRouter.use(express.static("./public/user"));
adminRouter.use(express.static("./public/admin"));

app.use('/', userRouter);
app.use('/adminLogin', adminRouter);



app.listen(PORT,()=>{console.log(`Server is running on http://localhost:${PORT}`)});