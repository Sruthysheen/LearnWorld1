import { Request, Response } from "express";
import Stripe from "stripe";
import Course from "../../models/courseModel";
import CartModel from "../../models/cartModel";
import orderModel from "../../models/orderModel";

require("dotenv").config();
const stripeSecretKey = process.env.STRIPE_KEY as string;
console.log(stripeSecretKey, "Keyy");


const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-04-10",
});


const stripePayment = async (req: Request, res: Response) => {
    try {
      console.log(req.body, "bodyyyyyyyyyyyyyyy");
  
      const line_items = req.body.cartItems.map((item: any) => {
        console.log(item, "ONE ITEM");
  
        return {
          price_data: {
            currency: "INR",
            product_data: {
              name: item?.course[0]?.courseName,
              images: item?.course[0]?.photo,
              description: item?.course[0]?.courseDescription,
              metadata: {
                id: item._id,
              },
            },
            unit_amount: item?.course[0]?.courseFee * 100,
          },
          quantity:1,
        };
      });
      console.log(line_items, "LINEITEMSSSS");
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
  
        billing_address_collection: "required",
        success_url: `${process.env.CLIENT_URL}/paymentSuccess`,
        cancel_url: `${process.env.CLIENT_URL}/cart`,
      });
  
      console.log(session.payment_status, "status", process.env.CLIENT_URL);
  
      if (session.payment_status === "unpaid") {
        const orderPromises = req.body.cartItems.map(async (cartItem: any) => {
          const studentId = cartItem?.student;
          const tutorId = cartItem?.course[0]?.tutor;
          const courseId = cartItem?.course[0]._id;
          const amount = cartItem?.course[0]?.courseFee;
  
          const order = await orderModel.create({
            studentId: studentId,
            tutorId: tutorId,
            courseId: courseId,
            amount: amount,
          });
  
          await order.save();
  
         
  
          await Course.findByIdAndUpdate(courseId, {
            $push: { students: studentId },
          });
  
          console.log("Order saved:", order);
          return order;
        });
  
        const orders = await Promise.all(orderPromises);
  
        res.json({
          status:true,
          url: session.url,
          orderIds: orders.map((order) => order._id),
          cart:req.body.cartItems
        });
      } else {
        res.status(400).json({ error: "Payment not completed yet." });
      }
    } catch (err) {
      console.error("Stripe Payment Error:", err);
      res.status(500).json({ error: "Payment error" });
    }
  };
  
  export { stripePayment };
