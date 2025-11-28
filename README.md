# Archer

> AI-powered productivity platform for students and young professionals. Align your daily tasks with your long-term goals.

Archer helps you focus on alignment, not just completion. It's designed to help you connect your day-to-day tasks with your broader goals, providing AI-powered insights and recommendations to keep you on track.

## Features

- **Task Management** - Create, organize, and track tasks with priorities and due dates
- **Goal Tracking** - Set and monitor short-term, mid-term, and long-term goals
- **AI-Powered Insights** - Get personalized recommendations and alignment scores
- **Reflections** - Capture daily reflections with sentiment analysis
- **Calendar Integration** - Sync with external calendar services
- **Notifications** - Stay informed with task reminders and goal milestones

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download/)) or a cloud PostgreSQL service (e.g., [Supabase](https://supabase.com))

## Getting Started

Follow these steps to get the project running on your local machine.

### Step 1: Clone the Repository

```bash
git clone git@github.com:kagaba-etienne/archer.git
# or git clone https://github.com/kagaba-etienne/archer.git
cd archer
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies including Next.js, Prisma, React, and other project dependencies.

### Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add the following environment variables to `.env.local`:

```env
# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/archer"

# JWT Secret (generate a secure random string for production)
JWT_SECRET="your_super_secret_jwt_key_change_in_production"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Optional: Enable Mock Server for Development
# NEXT_PUBLIC_ENABLE_MOCKS=true
```

**Important Notes:**

- Replace `user`, `password`, and `archer` with your actual PostgreSQL credentials and database name
- Generate a secure random string for `JWT_SECRET` in production (you can use `openssl rand -base64 32`)
- The `DATABASE_URL` format is: `postgresql://[user]:[password]@[host]:[port]/[database]`

#### Option A: Local PostgreSQL Setup

If you're using a local PostgreSQL installation:

1. Create the database:

   ```bash
   psql -U postgres -c "CREATE DATABASE archer;"
   ```

2. Update your `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/archer"
   ```

#### Option B: Supabase (Recommended for Development)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to **Project Settings** > **Database**
3. Copy the **Connection string** under "Connection pooling"
4. Update your `.env.local` with the connection string:
   ```env
   DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
   ```

### Step 4: Generate Prisma Client

Generate the Prisma Client to create TypeScript types for your database:

```bash
npm run db:generate
```

### Step 5: Set Up the Database Schema

Push the Prisma schema to your database to create all necessary tables:

```bash
npm run db:push
```

This command will:

- Create all database tables (User, Task, Goal, Reflection, Insight, Notification, CalendarAccount)
- Set up indexes for performance
- Configure relationships and constraints

### Step 6: (Optional) Initialize Mock Service Worker

If you want to use the mock API server for development, initialize MSW:

```bash
npx msw init public/ --save
```

Then enable it in your `.env.local`:

```env
NEXT_PUBLIC_ENABLE_MOCKS=true
```

### Step 7: Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

Open your browser and navigate to the URL to see the application.

### Step 8: Verify the Setup

1. **Check the application** - You should see the Archer landing page
2. **Test database connection** - You can use Prisma Studio to verify:

   ```bash
   npm run db:studio
   ```

   This opens a browser-based GUI at http://localhost:5555 where you can view and edit data.

3. **Test authentication** - Try creating an account via the signup page

## Development with Mock Server

If you want to develop the frontend without connecting to a real database, you can use the mock server:

1. Ensure MSW is initialized (see Step 6)
2. Set `NEXT_PUBLIC_ENABLE_MOCKS=true` in `.env.local`
3. Restart the development server

**Test Credentials (Mock Server):**

- Email: `test@archer.app`
- Password: `testpassword123`

## Available Scripts

### Development

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run type-check` - Run TypeScript compiler checks

### Database

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio GUI
- `npm run db:seed` - Seed database with sample data

### Testing

- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests only
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run test:e2e:ui` - Run E2E tests with Playwright UI

### Code Quality

- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Storybook

- `npm run storybook` - Start Storybook component development environment
- `npm run build-storybook` - Build Storybook for deployment

## Project Structure

```
archer/
├── prisma/
│   └── schema.prisma          # Database schema definition
├── src/
│   ├── app/                   # Next.js app directory
│   │   ├── (auth)/           # Authentication pages
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # Dashboard pages
│   │   └── layout.tsx        # Root layout
│   ├── components/           # React components
│   │   ├── features/        # Feature-specific components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utility libraries
│   │   ├── api/             # API client functions
│   │   ├── auth.ts          # Authentication utilities
│   │   ├── mocks/           # Mock server handlers
│   │   ├── prisma.ts        # Prisma Client instance
│   │   └── utils/           # Utility functions
│   ├── services/            # Business logic
│   │   ├── mutations/       # Data mutation functions
│   │   └── queries/         # Data query functions
│   ├── stores/              # State management (Zustand)
│   └── types/               # TypeScript type definitions
├── e2e/                      # End-to-end tests
└── public/                   # Static assets
```

## Database Schema

The application uses the following main models:

- **User** - User accounts with authentication
- **Task** - User tasks with status, priority, and due dates
- **Goal** - Long-term goals with progress tracking
- **Reflection** - User reflections with AI sentiment analysis
- **Insight** - AI-generated alignment scores and recommendations
- **Notification** - System notifications and reminders
- **CalendarAccount** - Connected calendar accounts

See [prisma/schema.prisma](prisma/schema.prisma) for the complete schema definition.

## Testing

### Unit Tests

Run unit tests with Vitest:

```bash
npm run test:unit
```

### End-to-End Tests

Run E2E tests with Playwright:

```bash
npm run test:e2e
```

### Test Coverage

Generate a coverage report:

```bash
npm run test:coverage
```

## Troubleshooting

### Database Connection Issues

**Error: "Can't reach database server"**

- Verify your `DATABASE_URL` in `.env.local` is correct
- Check that PostgreSQL is running: `psql -U postgres -h localhost`
- Ensure the database exists: `psql -U postgres -c "\l"` (lists all databases)

### Prisma Issues

**Error: "Prisma Client not generated"**

```bash
npm run db:generate
```

**Error: "Table doesn't exist"**

```bash
npm run db:push
```

### Environment Variables

**Error: "JWT_SECRET is not defined"**

- Ensure `.env.local` exists in the root directory
- Verify `JWT_SECRET` is set in `.env.local`
- Restart the development server after adding environment variables

### Port Already in Use

**Error: "Port 3000 is already in use"**

- Stop the process using port 3000, or
- Set a different port: `PORT=3001 npm run dev`

### Mock Server Not Working

- Ensure MSW is initialized: `npx msw init public/ --save`
- Check that `NEXT_PUBLIC_ENABLE_MOCKS=true` is set in `.env.local`
- Restart the development server
- Clear browser cache and hard refresh

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT (JSON Web Tokens)
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Styling:** Tailwind CSS
- **Testing:** Vitest, Playwright, Testing Library
- **Component Development:** Storybook
- **Mocking:** MSW (Mock Service Worker)

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Run tests: `npm test`
4. Run linting: `npm run lint`
5. Submit a pull request

## Hosted Version

[🚀 **Live Demo**](https://vercel.com/kagabaetiennes-projects/archer/Dgd2Tt9z41iQErUDJDtFuk1qzyRW)
