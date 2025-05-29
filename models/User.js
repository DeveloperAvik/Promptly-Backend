const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, "Please enter a valid email address"],
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false,
        },
        trailActive: { type: Boolean, required: true },
        trailExpire: Date,
        subscription: {
            type: String,
            enum: ["Trail", "Free", "Basic", "Premium"],
        },
        apiRequestCount: { type: Number, default: 0 },
        monthlyRequestCount: { type: Number, default: 0 },
        nextBillingDate: Date,
        payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payment" }],
        history: [{ type: mongoose.Schema.Types.ObjectId, ref: "History" }],
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
