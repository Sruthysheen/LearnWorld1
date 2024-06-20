import express from 'express';
import { stripePayment } from '../../controller/paymentController/paymentController';
const paymentRouter = express.Router();

paymentRouter.post('/stripepayment',stripePayment)


export default paymentRouter