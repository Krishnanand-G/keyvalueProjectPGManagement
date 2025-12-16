import express from 'express';
import { db } from '../config/db.js';
import { rooms, users } from '../db/schema.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { eq, sql } from 'drizzle-orm';

const router = express.Router();

// GET /api/rooms - Get all rooms with current tenant count
router.get('/', authenticateToken, async (req, res) => {
    try {
        const allRooms = await db.select().from(rooms);

        // For each room, count how many tenants are assigned
        const roomsWithTenantCount = await Promise.all(
            allRooms.map(async (room) => {
                const tenantCount = await db
                    .select({ count: sql`count(*)` })
                    .from(users)
                    .where(eq(users.roomId, room.id));

                return {
                    ...room,
                    currentTenants: parseInt(tenantCount[0].count) || 0,
                };
            })
        );

        res.json({ rooms: roomsWithTenantCount });
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
            room: { ...newRoom, currentTenants: 0 },
        });
    } catch (error) {
        console.error('Create room error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
