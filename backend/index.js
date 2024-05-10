const express = require("express");
require("dotenv").config();
const app = express();
const router = express.Router();
const cloudinary = require("cloudinary");
const connection = require("./database/connection");
const productRouter = require("./routers/productRouter");
const userRouter = require("./routers/userRouter");
const orderRouter = require("./routers/orderRouter");
const paymentRouter = require("./routers/paymentRouter");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const cors = require("cors");
const path = require("path");

const port = process.env.PORT || 5000;

const corsOption = {
	origin: '*',
	credentials: true,
	allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
	methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
	optionsSuccessStatus: 200  
  }

app.use(express.static(path.join(__dirname,"../frontend/build")))  
app.use(express.json());
app.use(cors(corsOption));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileupload());
app.use("/api/auth",productRouter);
app.use("/api/auth",userRouter);
app.use("/api/auth",orderRouter);
app.use("/api/auth",paymentRouter);

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

app.get("/",(req,res) => {
	res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"));
});

connection().then(()=>{
	app.listen(port,()=>{
		console.log(`app listening on port: ${port}`);
	});
});
