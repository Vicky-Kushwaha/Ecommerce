const mongoose = require("mongoose");

const URL = process.env.DB_URL;

const connection = async() => {
	try{
     
     await mongoose.connect(`${URL}`);
     console.log(`database connection successful`);

	}catch(err){
		console.error(err);
		process.exit(1);
	}

}

module.exports = connection;