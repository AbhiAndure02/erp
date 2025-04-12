import mongoose from "mongoose";

const financeSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    descriptin: {
        type: String,
        default: 0,
    },
    income: {
        type: String,
        default: 0,
    },
    type: {
        type:String,
        enum:['income', 'expense', 'balance'],
    },
    createAt:{
        type: Date,
        default: Date.now,
    }

});
const Finance = mongoose.model('Finance', financeSchema);
export default Finance;