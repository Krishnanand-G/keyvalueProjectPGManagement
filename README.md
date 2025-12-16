# PG Management System

> A landlord-tenant management web app I built for managing paying guest accommodations. It's got room management, payment tracking, and complaint handling - basically everything you need to run a PG without losing your mind.

## What This Thing Does

So basically, if you're running a PG (or just want to learn full-stack dev), this app handles:

- **Different logins** for landlords and tenants (obviously they need to see different stuff)
- **Room management** - add rooms, assign tenants, check who's living where
- **Payment tracking** - tenants upload payment proofs, landlords can approve/reject
- **Complaints** - tenants can complain, landlords can respond (just like real life lol)
- **Payment status** - see who paid rent and who's dodging it 👀

## Tech Stack (aka what I used to build this)

**Frontend:**
- React + Vite (because create-react-app is slow af)
- React Router (for navigation)
- Axios (for API calls)
- Lucide React (nice looking icons)

**Backend:**
- Node.js + Express (the classic combo)
- PostgreSQL on Supabase (free tier ftw)
- Drizzle ORM (type-safe queries, no SQL injection worries)
- JWT for auth (stateless tokens are neat)
- bcrypt for passwords (never storing plain text like a noob)

## Getting Started

### Prerequisites
- Node.js (I used v20+ but v18 should work too)
- A Supabase account (it's free)
- Git (obviously)

### Installation

1. **Clone this thing**
```bash
git clone https://github.com/Krishnanand-G/keyvalueProjectPGManagement.git
cd keyvalueProjectPGManagement
```

2. **Install frontend packages**
```bash
npm install
```

3. **Install backend packages**
```bash
cd server
npm install
```

4. **Setup environment variables**

Create a `.env` file in the `server` folder:
```env
DATABASE_URL=your_supabase_connection_string_here
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=some_random_secret_string_make_it_long
PORT=3001
```

> **Note:** Get your Supabase credentials from your project settings. Use the "session pooler" connection string for DATABASE_URL.

5. **Push database schema**
```bash
cd server
npx drizzle-kit push
```

This will create all the tables in your Supabase database.

6. **Run the backend**
```bash
npm run dev
```

Server starts on http://localhost:3001

7. **Run the frontend** (in a new terminal)
```bash
cd ..  # back to root
npm run dev
```

Frontend starts on http://localhost:5173

## Default Login

The app creates a default landlord account automatically:

- **Username:** landlord@pg.in
- **Password:** landlord123

You can create tenant accounts from the landlord dashboard.

## Project Structure

```
keyValue/
├── src/                    # Frontend React code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Main pages (Landlord/Tenant homes)
│   ├── context/           # Auth context for login state
│   └── utils/             # API helper
│
├── server/                # Backend Express server
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth middleware
│   │   ├── config/        # DB config
│   │   └── db/           # Database schema
│   └── drizzle.config.js  # Drizzle ORM config
│
└── README.md             # You're reading it!
```

## Features Breakdown

### For Landlords:
- View all rooms with occupancy status
- Add new rooms (with max tenant limit)
- See all tenants in one place
- Check payment status for each tenant
- View and manage complaints
- Approve/reject payment submissions
- Click on tenant names to see their details

### For Tenants:
- See your room and roommate info
- Submit monthly payment with proof (image upload)
- View payment status (paid/unpaid)
- Create and track complaints
- See recent complaint updates
- View roommate details

## API Endpoints

Quick reference for the main endpoints:

**Auth:**
- `POST /api/auth/login` - Login for both roles
- `POST /api/auth/create-tenant` - Landlord creates tenant

**Rooms:**
- `GET /api/rooms` - Get all rooms with tenant details
- `POST /api/rooms` - Create new room

**Tenants:**
- `GET /api/tenants` - Get all tenants (landlord)
- `GET /api/tenants/me` - Get current tenant info
- `PATCH /api/tenants/:id` - Update tenant
- `DELETE /api/tenants/:id` - Delete tenant

**Payments:**
- `POST /api/payments` - Submit payment
- `GET /api/payments/current-month` - Check if paid this month
- `GET /api/payments/all` - Get payment history
- `PATCH /api/payments/:id/status` - Approve/reject payment

**Complaints:**
- `GET /api/complaints` - Get all complaints
- `POST /api/complaints` - Create complaint
- `PATCH /api/complaints/:id` - Update status/add remarks

## Things I Learned Building This

- How to properly implement JWT authentication (and why not to put it in localStorage... but I did anyway 😅)
- Drizzle ORM is actually pretty nice for type safety
- Base64 encoding for images works but probably not the best for production
- Room capacity validation is important (can't have 10 people in a 2-person room)
- Payment tracking is more complex than it seems
- CORS can be annoying but it's just one line of code

## Known Issues / TODO

- [ ] Image uploads use base64 which bloats the database - should use Supabase Storage
- [ ] No email notifications (everything is manual)
- [ ] Could use some loading states in more places
- [ ] Mobile UI needs work (it's responsive but not optimized)
- [ ] No pagination (works fine for small PGs but would break with 100+ tenants)
- [ ] Should add forgot password feature
- [ ] Payment proof viewing could be better (no zoom/download)

## Future Enhancements

If I ever come back to this:
- Real-time updates with WebSockets
- Email/SMS notifications for payments and complaints
- Expense tracking for landlords
- Analytics dashboard
- Multiple property support
- Maintenance request system
- Better mobile experience

## Why I Built This

Honestly? Needed a full-stack project for my portfolio. But also, my friend runs a PG and manages everything on WhatsApp and Excel sheets, which is chaotic. This would actually be useful for small PG owners.

## Contributing

Feel free to fork and improve! I'm sure there are bugs I haven't found yet. PRs are welcome.

## License

MIT - do whatever you want with it

## Contact

Made by [Your Name] - feel free to reach out if you have questions!

---

**Final thoughts:** This was a fun project. Started simple and kept adding features. The payment tracking with image uploads was tricky but works now. Could definitely use some UI polish but it's functional. If you're learning full-stack, this has pretty much everything - auth, CRUD, file uploads, role-based access, etc.

Happy coding! 🚀
