import express from 'express';
import { db } from '../config/db.js';
import { complaints, rooms } from '../db/schema.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { eq, desc } from 'drizzle-orm';

const router = express.Router();

// GET /api/complaints - Get complaints (filtered by role)
router.get('/', authenticateToken, async (req, res) => {
    try {
        let allComplaints;

        if (req.user.role === 'tenant') {
            // Tenants see only their own complaints
            allComplaints = await db
                .select()
                .from(complaints)
                .where(eq(complaints.userId, req.user.id))
                .orderBy(desc(complaints.createdAt));
        } else {
            // Landlords see all complaints
            allComplaints = await db
                .select()
                .from(complaints)
                .orderBy(desc(complaints.createdAt));
        }

        res.json({ complaints: allComplaints });
    } catch (error) {
        console.error('Get complaints error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/complaints - Create new complaint (tenant only)
router.post('/', authenticateToken, requireRole('tenant'), async (req, res) => {
    try {
        const { title, description, roomId } = req.body;

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const [newComplaint] = await db.insert(complaints).values({
            userId: req.user.id,
            roomId: roomId || null,
            title,
            description,
            status: 'open',
        }).returning();

        res.status(201).json({
            message: 'Complaint created successfully',
            complaint: newComplaint,
        });
    } catch (error) {
        console.error('Create complaint error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/complaints/:id - Update complaint
router.patch('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, landlordRemark } = req.body;

        // Only landlords can update complaints
        if (req.user.role !== 'landlord') {
            return res.status(403).json({ error: 'Only landlords can update complaints' });
        }

        const [updatedComplaint] = await db
            .update(complaints)
            .set({
                status: status || undefined,
                landlordRemark: landlordRemark !== undefined ? landlordRemark : undefined,
                updatedAt: new Date(),
            })
            .where(eq(complaints.id, id))
            .returning();

        if (!updatedComplaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        res.json({
            message: 'Complaint updated successfully',
            complaint: updatedComplaint,
        });
    } catch (error) {
        console.error('Update complaint error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
