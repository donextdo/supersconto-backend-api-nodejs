const {Schema} = require("mongoose");
const mongoose = require("mongoose");
const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'role'
    },
    role: {
        type: String,
        required: true,
        enum: ['Vendor', 'Admin']
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // expires: 60*5,// this is the expiry time in seconds
    },
});
module.exports = mongoose.model("Token", tokenSchema);