const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: [/.+@.+\..+/, "Please enter a valid email address"],
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },
        trialActive: { type: Boolean, required: true },
        trialExpire: Date,
        trailPeriod : {
            type:Number,
            default: 7 // 7 days 
        },
        subscription: {
            type: String,
            enum: ["Trial", "Free", "Basic", "Premium"],
            default: "Trial"
        },
        apiRequestCount: { type: Number, default: 0 },
        monthlyRequestCount: { type: Number, default: 0 },
        nextBillingDate: Date,
        payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
        history: [{ type: mongoose.Schema.Types.ObjectId, ref: "History" }],
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("email")) {
        this.email = this.email.toLowerCase();
    }
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        return ret;
    }
});


userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
