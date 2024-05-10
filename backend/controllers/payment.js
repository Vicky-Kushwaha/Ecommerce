
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const processPayment = async (req, res, next) => {
 
    try{

  const {amount, user, shippingInfo} = req.body;    

  const myPayment = await stripe.paymentIntents.create({
    amount: amount,
    currency: "inr",
    description: "Ecommerce project",
    shipping: {
      name: user,
      address: {
        line1: "510 Townsend St",
        postal_code: "98140",
        city: "San Francisco",
        state: "CA",
        country: "US",
      },
    },
});

res.status(200).json({ success: true, client_secret: myPayment.client_secret });


}catch(error){
    res.status(500).json({message: error.message});
}
};




const sendStripeApiKey = async (req, res, next) => {

 try{

  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
 }catch(error){
    res.status(500).json({message: error.message});
 }
};

module.exports = {sendStripeApiKey, processPayment};
