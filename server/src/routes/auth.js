import express from 'express';
import bcrypt from 'bcrypt';
import { db } from '../config/db.js';
import { users } from '../db/schema.js';
import { generateToken } from '../utils/jwt.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { eq } from 'drizzle-orm';

const router = express.Router();

// POST /api/auth/register - Create initial landlord account
router.post('/register', async (req, res) => {
    try {
        const { username, password, name, age, phone } = req.body;

        // Validate input
        if (!username || !password || !name) {
            return res.status(400).json({ error: 'Username, password, and name are required' });
        }

        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.username, username));
        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create landlord user
        const [newUser] = await db.insert(users).values({
            username,
            passwordHash,
            role: 'landlord',
            name,
            age: age || null,
            phone: phone || null,
        }).returning();

        // Generate token
        const token = generateToken(newUser);

        res.status(201).json({
            message: 'Landlord account created successfully',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role,
                name: newUser.name,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/login - Login for both tenant and landlord
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user
        const [user] = await db.select().from(users).where(eq(users.username, username));

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                name: user.name,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/create-tenant - Landlord creates tenant account
router.post('/create-tenant', authenticateToken, requireRole('landlord'), async (req, res) => {
    try {
        const { username, password, name, age, phone, roomId, cautionDeposit } = req.body;

        if (!username || !password || !name) {
            return res.status(400).json({ error: 'Username, password, and name are required' });
        }

        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.username, username));
        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create tenant user
        const [newTenant] = await db.insert(users).values({
            username,
            passwordHash,
            role: 'tenant',
            name,
            age: age || null,
            phone: phone || null,
            roomId: roomId || null,
            cautionDeposit: cautionDeposit || null,
        }).returning();

        res.status(201).json({
            message: 'Tenant created successfully',
            tenant: {
                id: newTenant.id,
                username: newTenant.username,
                role: newTenant.role,
                name: newTenant.name,
            },
        });
    } catch (error) {
        console.error('Create tenant error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /api/auth/me - Get current user info
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.id, req.user.id));

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                name: user.name,
                age: user.age,
                phone: user.phone,
                roomId: user.roomId,
            },
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
