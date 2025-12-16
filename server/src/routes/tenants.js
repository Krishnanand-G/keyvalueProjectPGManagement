import express from 'express';
import { db } from '../config/db.js';
import { users, rooms } from '../db/schema.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { eq, sql } from 'drizzle-orm';

const router = express.Router();

// GET /api/tenants - Get all tenants (landlord only)
router.get('/', authenticateToken, requireRole('landlord'), async (req, res) => {
    try {
        // Get all users with role 'tenant' and join with rooms
        const allTenants = await db
            .select({
                id: users.id,
                username: users.username,
                name: users.name,
                age: users.age,
                phone: users.phone,
                roomId: users.roomId,
                cautionDeposit: users.cautionDeposit,
                createdAt: users.createdAt,
                roomNumber: rooms.roomNumber,
            })
            .from(users)
            .leftJoin(rooms, eq(users.roomId, rooms.id))
            .where(eq(users.role, 'tenant'));

        res.json({ tenants: allTenants });
    } catch (error) {
        console.error('Get tenants error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/tenants/me - Get current tenant's info
router.get('/me', authenticateToken, requireRole('tenant'), async (req, res) => {
    try {
        const [tenant] = await db
            .select({
                id: users.id,
                username: users.username,
                name: users.name,
                age: users.age,
                phone: users.phone,
                roomId: users.roomId,
                cautionDeposit: users.cautionDeposit,
                roomNumber: rooms.roomNumber,
                maxTenants: rooms.maxTenants,
                rentPerTenant: rooms.rentPerTenant,
            })
            .from(users)
            .leftJoin(rooms, eq(users.roomId, rooms.id))
            .where(eq(users.id, req.user.id));

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        // Get roommates if has a room
        let roommates = [];
        if (tenant.roomId) {
            roommates = await db
                .select({
                    id: users.id,
                    name: users.name,
                    age: users.age,
                })
                .from(users)
                .where(eq(users.roomId, tenant.roomId));

            // Remove self from roommates
            roommates = roommates.filter(r => r.id !== tenant.id);
        }

        res.json({ tenant, roommates });
    } catch (error) {
        console.error('Get tenant info error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PATCH /api/tenants/:id - Update tenant (landlord only)
router.patch('/:id', authenticateToken, requireRole('landlord'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, phone, roomId, cautionDeposit } = req.body;

        const [updatedTenant] = await db
            .update(users)
            .set({
                name: name || undefined,
                age: age || undefined,
                phone: phone || undefined,
                roomId: roomId || undefined,
                cautionDeposit: cautionDeposit || undefined,
            })
            .where(eq(users.id, id))
            .returning();

        if (!updatedTenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        res.json({
            message: 'Tenant updated successfully',
            tenant: updatedTenant,
        });
    } catch (error) {
        console.error('Update tenant error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/tenants/:id - Delete tenant (landlord only)
router.delete('/:id', authenticateToken, requireRole('landlord'), async (req, res) => {
    try {
        const { id } = req.params;

        const [deletedTenant] = await db
            .delete(users)
            .where(eq(users.id, id))
            .returning();

        if (!deletedTenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        res.json({
            message: 'Tenant deleted successfully',
            tenant: deletedTenant,
        });
    } catch (error) {
        console.error('Delete tenant error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
