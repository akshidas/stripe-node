const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51M6Xv5SHo9JW2FopaFPU9pTMsawk7b145K3jZq66TsdlndvAojuAT6xI8hMUyxXDy7Gye4XrOsMWoaw7FPItRoSH00HPbf6zxZ"
);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Stripe Test");
});

app.post("/session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      cancel_url: `${req.headers.origin}/user/online-store/product-subscription/checkout`,
      success_url: `${req.headers.origin}/user/online-store/my-orders`,
      customer_email: "akshay@bpract.com",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Bugati",
            },
            unit_amount: 20000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
    });
    res.json({ stripeSession: session.url });
  } catch (err) {
    console.error(err);
  }
});
app.post("/intend", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 550,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error(err);
  }
});

app.listen(3001, () => console.log("Server listening on port 3001"));
