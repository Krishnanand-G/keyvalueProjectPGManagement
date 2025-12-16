import express from 'express';
import { db } from '../config/db.js';
import { rooms, users, payments } from '../db/schema.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { eq, and } from 'drizzle-orm';

const router = express.Router();

// GET /api/rooms - Get all rooms with tenant details and payment status
router.get('/', authenticateToken, async (req, res) => {
    try {
        const allRooms = await db.select().from(rooms);
        const currentMonth = new Date().toISOString().slice(0, 7);

        // For each room, get tenant details with payment status
        const roomsWithDetails = await Promise.all(
            allRooms.map(async (room) => {
                const tenants = await db
                    .select({
                        id: users.id,
                        name: users.name,
                        age: users.age,
                        phone: users.phone,
                        username: users.username,
                    })
                    .from(users)
                    .where(eq(users.roomId, room.id));

                // Check payment status for each tenant
                const tenantsWithPayment = await Promise.all(
                    tenants.map(async (tenant) => {
                        const [payment] = await db
                            .select()
                            .from(payments)
                            .where(
                                and(
                                    eq(payments.userId, tenant.id),
                                    eq(payments.month, currentMonth)
                                )
                            );

                        return {
                            ...tenant,
                            hasPaidThisMonth: !!payment,
                        };
                    })
                );

                return {
                    ...room,
                    currentTenants: tenants.length,
                    tenants: tenantsWithPayment,
                };
            })
        );

        res.json({ rooms: roomsWithDetails });
    } catch (error) {
        console.error('Get rooms error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/rooms - Create a new room (landlord only)
router.post('/', authenticateToken, requireRole('landlord'), async (req, res) => {
    try {
        const { roomNumber, maxTenants, rentPerTenant } = req.body;

        if (!roomNumber || !maxTenants || !rentPerTenant) {
            return res.status(400).json({ error: 'Room number, max tenants, and rent are required' });
        }

        const [newRoom] = await db.insert(rooms).values({
            roomNumber: parseInt(roomNumber),
            maxTenants: parseInt(maxTenants),
            rentPerTenant: parseInt(rentPerTenant),
        }).returning();

        res.status(201).json({
            message: 'Room created successfully',
            room: { ...newRoom, currentTenants: 0, tenants: [] },
        });
    } catch (error) {
        console.error('Create room error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
