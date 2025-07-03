# Shan Bhoharia's Study Hub

A modern, responsive web application for college students to access study materials, assignments, practicals, and previous year examination papers.

## Features

### For Students (Read-Only Access)
- Browse study materials by semester and subject
- Access notes, practicals, and assignments
- Download previous year exam papers (Internal & University)
- Search across all materials
- Mobile-responsive design

### For Admin (Content Management)
- Upload study materials by subject and type
- Upload exam papers by semester and year
- Add new subjects and semesters
- Full content management through admin panel

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Vercel/Railway/Render ready

## Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Set up environment variables
echo "DATABASE_URL=your_database_url" > .env

# Initialize database
npm run db:push

# Start development server
npm run dev
```

### Production Deployment
1. Deploy to Vercel/Railway/Render
2. Set DATABASE_URL environment variable
3. Database tables are created automatically

## Project Structure

```
├── client/src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   └── lib/           # Utilities and types
├── server/
│   ├── routes.ts      # API endpoints
│   ├── storage.ts     # Database operations
│   └── db.ts          # Database connection
├── shared/
│   └── schema.ts      # Database schema and types
└── package.json
```

## Admin Panel

Access the admin panel at `/admin` to:
- Upload study materials (notes, practicals, assignments)
- Upload exam papers organized by year
- Manage subjects and semesters

## Security

- Read-only access for students
- No authentication required for content consumption
- Admin panel for content management only
- No editing capabilities for public users

## Database Schema

- **Semesters**: Academic semester information
- **Subjects**: Subject details linked to semesters  
- **Materials**: Study materials (notes, practicals, assignments)
- **Exam Papers**: Previous year papers with metadata

## Environment Variables

```
DATABASE_URL=postgresql://...
NODE_ENV=production
```

## License

Educational use only - Created for Shan Bhoharia's academic resource sharing.