const prisma = require("../config/prisma");
const stripe = require("stripe")(
  "sk_test_51QUoZFELX0FBVwFulSYTj9pzXcc5k89VtjvMef7h9Txb048K1rJtDx8cDeq0sPXZ89BiozDuhIJpIzeDvQrrgyxv00Bceoyim5"
);

exports.payment = async (req, res) => {
  try {
    //code
    // Check user
    // req.user.id
    console.log(req.user.id)
    const cart = await prisma.cart.findFirst({
      where:{
        orderedById : req.user.id
      }
    })
    const amountTHB = cart.cartTotal * 100

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountTHB,
      currency: "thb",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
