const {Schema, model} = require("mongoose");

const ProductSchema = new Schema({
	name:{
		type:String,
		required:[true,"Please enter product name"],
		trim: true
	},
	description:{
		type:String,
		required:[true,"Please enter product description"]
	},
	price:{
		type:Number,
		required:[true,"Please enter product price"],
		maxLength:[8,"Price cannot exceed 8 characters"]
	},
	ratings:{
		type:Number,
	    default:0
	},
	images:[
       {
       	public_id:{
       		type:String,
       		required:true
       	},
       	url:{
       		type:String,
       		required:true
       	}
       }
		],
    category:{
		type:String,
		required:[true,"Please enter product category"]
	},
	stock:{
		type:String,
		required:[true,"Please enter product stock"],
		maxLength:[4,"Stock cannot exceed 4 characters"],
	    default:1
	},
    numOfReviews:{
    	type:String,
        default:0
    },
    reviews:[
        {
            user:{
            	type: Schema.ObjectId,
            	ref: "user",
            	required: true,
            },

        	name:{
        		type:String,
        		required:true
        	},
        	rating:{
        		type:Number,
        		required:true
        	},
        	comment:{
        		type:String,
        		required:true
        	}
        }
    	],
    
    user: {
    	type: Schema.ObjectId,
    	ref: "user",
    	required: true
    },

    createdAt:{
    	type:Date,
        default: Date.now
    }
})

const product = model("product",ProductSchema);

module.exports = product;