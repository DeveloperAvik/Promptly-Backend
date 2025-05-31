const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        reference: {
            type: String,
            required: true,
            unique: true, 
        },
        currency: {
            type: String,
            required: true,
            enum: ["USD", "EUR", "INR"], 
        },
        status: {
            type: String,
            default: "pending",
            required: true,
            enum: ["pending", "completed", "failed", "refunded"]
        },
        amount: {
            type: Number,
            default: 0,
            min: 0
        },
        monthlyRequestCount: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true,
    }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
