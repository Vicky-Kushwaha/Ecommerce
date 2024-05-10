const Order = require("../models/orderModel");
const Product = require("../models/productModel");


//Create new Order
const newOrder = async(req,res) => {
	try{

	const {shippingInfo,orderItem,paymentInfo,itemPrice,shippingPrice,totalPrice} = req.body;
	
	const order = await Order.create({shippingInfo,orderItem,paymentInfo,itemPrice,shippingPrice,totalPrice,paidAt: Date.now(),user: req.user._id});


	res.status(201).json({
		success: true,
		order
	});	


	}catch(err){
		res.status(500).json({message: err.message});
	}
}


//get single order
const getSingleOrder = async(req,res) => {
	try{

     const order = await Order.findById(req.params.id).populate(
          "user",
          "name email"
     	);

     if(!order){
     	return res.status(404).json({message: "Order with this Id is not found"});
     }


     res.status(200).json({
     	success: true,
     	order
     })			


	}catch(err){
		res.status(500).json({message: err.message});
	}
}


//get logged in user orders
const myOrders = async(req,res) => {
	try{

     const orders = await Order.find({ user: req.user._id });

     if(!orders){
     	return res.status(404).json({message: "Order with this Id is not found"});
     }


     res.status(200).json({
     	success: true,
     	orders
     })			


	}catch(err){
		res.status(500).json({message: err.message});
	}
}


//get all orders (admin)
const getAllOrders = async(req,res) => {
	try{

	const orders = await Order.find();

	let totalAmount = 0;

	orders.forEach((order)=>{
		totalAmount += order.totalPrice;
	});
	
	res.status(200).json({
		success: true,
		totalAmount,
		orders
	});	


	}catch(err){
		res.status(500).json({message: err.message});
	}
}



//update order status (admin)
const updateOrder = async(req,res) => {
	try{

	const order = await Order.findById(req.params.id);
	
	if(!order.orderStatus === "Delivered"){
		return res.status(400).json({message: "You have already delivered this order"});
	}

	order.orderItem.forEach(async(o)=> {
		await updateStock(o.product,o.quantity);
	});

	order.orderStatus = req.body.status;

	if(req.body.status === "Delivered"){
		order.deliverdAt = Date.now();
	}

	await order.save({validateBeforeSave: false});

	res.status(200).json({
		success: true
	});	


	}catch(err){
		res.status(500).json({message: err.message});
	}
}



// function to update stock
async function updateStock(id,quantity){
	const product = await Product.findById(id);

	product.stock -= quantity;

	product.save({validateBeforeSave: false});
}


//delete order (admin)
const deleteOrder = async(req,res) => {
	try{

	const order = await Order.findById(req.params.id);
	
	if(!order){
		return res.status(404).json({message: "Order not found with this Id"})
	}

	await Order.findByIdAndDelete(req.params.id);

	res.status(200).json({
		success: true
	})	


	}catch(err){
		res.status(500).json({message: err.message});
	}
}

module.exports = {newOrder,getSingleOrder,myOrders,getAllOrders,updateOrder,deleteOrder};