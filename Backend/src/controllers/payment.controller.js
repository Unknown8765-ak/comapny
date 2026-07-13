import crypto from "crypto";
import { instance } from "../index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Company } from "../models/company.model.js";

const processPayment = asyncHandler(async (req, res) => {

  const { plan } = req.body;

  let amount;

  if (plan === "monthly") {
    amount = 399;
  }

  if (plan === "yearly") {
    amount = 3999;
  }

  const options = {
    amount: Number(amount * 100),
    currency: "INR",
    receipt: `receipt_${Date.now()}`
  };

  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order
  });

});

const getKey = asyncHandler(async (req, res) => {

  res.status(200).json({
    success: true,
    key: process.env.Test_API_Key
  });
  // console.log(process.env.Test_API_Key)

});



const verifyPayment = asyncHandler(async (req, res) => {

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
  } = req.body;


  const body =
    razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac(
      "sha256",
      process.env.Test_Key_Secret
    )
    .update(body.toString())
    .digest("hex");

  const isAuthentic =
    expectedSignature === razorpay_signature;

  if (!isAuthentic) {

    return res.status(400).json({
      success: false,
      message: "Payment Verification Failed"
    });

  }
  const companyId = req.user.company;
  const company = await Company.findById(companyId);

  if (!company) {

    return res.status(404).json({
      success: false,
      message: "Company not found"
    });

  }

  const endDate = new Date();

  if (plan === "monthly") {
    endDate.setMonth(endDate.getMonth() + 1);
  }

  if (plan === "yearly") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }


  company.plan = "pro";

  company.subscriptionType = plan;
  company.subscriptionStatus = "active";
  company.subscriptionEndDate = endDate;
  company.razorpay_order_id =
    razorpay_order_id;
  company.razorpay_payment_id =
    razorpay_payment_id;
  await company.save();

  // console.log(company)
  res.status(200).json({
    success: true,
    message: "Payment Verified Successfully",
    company
  });

});



export {
  processPayment,
  verifyPayment,
  getKey
};
