import express from 'express';
import { addPayment, getPayments } from '../controllers/finace.controller.js';


const router = express.Router();

router.post('/', addPayment)
router.get('/', getPayments)

export default router;