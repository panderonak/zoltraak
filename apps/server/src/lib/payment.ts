import { env } from "@zoltraak/env/server";
import Razorpay from "razorpay";

const payment = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export { payment };
