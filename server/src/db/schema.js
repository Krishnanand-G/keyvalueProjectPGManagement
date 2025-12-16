import { pgTable, uuid, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const roleEnum = pgEnum('role', ['tenant', 'landlord']);
export const complaintStatusEnum = pgEnum('complaint_status', ['open', 'in_progress', 'resolved']);
export const paymentStatusEnum = pgEnum('payment_status', ['submitted', 'approved', 'rejected']);

// Rooms table
export const rooms = pgTable('rooms', {
    id: uuid('id').primaryKey().defaultRandom(),
    roomNumber: integer('room_number').notNull(),
    maxTenants: integer('max_tenants').notNull(),
    rentPerTenant: integer('rent_per_tenant').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

// Users table
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    username: text('username').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: roleEnum('role').notNull(),
    name: text('name').notNull(),
    age: integer('age'),
    phone: text('phone'),
    roomId: uuid('room_id').references(() => rooms.id),
    cautionDeposit: integer('caution_deposit'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Complaints table
export const complaints = pgTable('complaints', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id),
    roomId: uuid('room_id').references(() => rooms.id),
    title: text('title').notNull(),
    description: text('description').notNull(),
    status: complaintStatusEnum('status').notNull().default('open'),
    landlordRemark: text('landlord_remark'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Payments table
export const payments = pgTable('payments', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    month: text('month').notNull(), // Format: YYYY-MM
    proofUrl: text('proof_url'),
    amount: integer('amount'),
    status: paymentStatusEnum('status').default('submitted'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
