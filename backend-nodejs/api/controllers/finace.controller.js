import Finance from "../models/finace.model.js";

export const addPayment = async (req, res) => {
    
        const { userId, income, descriptin,type } = req.body;

    try {
        const newFinance = new Finance({
            userId,
            income,
            descriptin,
            type,
            
        });

        await newFinance.save();
        res.status(201).json(newFinance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getPayments = async (req, res) => {
    try {
        const payments = await Finance.find();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}