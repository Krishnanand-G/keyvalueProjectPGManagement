import express from 'express';
import { db } from '../config/db.js';
import { payments } from '../db/schema.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { eq, and, sql } from 'drizzle-orm';

const router = express.Router();

// GET /api/payments/status/:month - Check if tenant has paid for a specific month
router.get('/status/:month', authenticateToken, requireRole('tenant'), async (req, res) => {
    try {
        const { month } = req.params; // Format: YYYY-MM

        const [payment] = await db
            .select()
            .from(payments)
            .where(
                and(
                    eq(payments.userId, req.user.id),
                    eq(payments.month, month)
                )
            );

        res.json({
            hasPaid: !!payment,
            payment: payment || null
        });
    } catch (error) {
        console.error('Check payment status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/payments/current-month - Check if tenant has paid for current month
router.get('/current-month', authenticateToken, requireRole('tenant'), async (req, res) => {
    try {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

        const [payment] = await db
            .select()
            .from(payments)
            .where(
                and(
                    eq(payments.userId, req.user.id),
                    eq(payments.month, currentMonth)
                )
            );

        res.json({
            hasPaid: !!payment,
            month: currentMonth,
            payment: payment || null
        });
    } catch (error) {
        console.error('Check current month payment error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/payments - Submit payment proof
router.post('/', authenticateToken, requireRole('tenant'), async (req, res) => {
    try {
        const { month, proofUrl } = req.body;

        if (!month) {
            return res.status(400).json({ error: 'Month is required' });
        }

        // Check if already paid for this month
        const [existing] = await db
            .select()
            .from(payments)
            .where(
                and(
                    eq(payments.userId, req.user.id),
                    eq(payments.month, month)
                )
            );

        if (existing) {
            return res.status(400).json({ error: 'Payment already submitted for this month' });
        }

        const [newPayment] = await db.insert(payments).values({
            userId: req.user.id,
            month,
            proofUrl: proofUrl || null,
        }).returning();

        res.status(201).json({
            message: 'Payment submitted successfully',
            payment: newPayment,
        });
    } catch (error) {
        console.error('Submit payment error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
