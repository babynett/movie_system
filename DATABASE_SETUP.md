# Database Setup Guide

## Prerequisites

1. **PostgreSQL Installation**: Make sure PostgreSQL is installed and running on your system.
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql postgresql-contrib`

## Configuration Steps

### 1. Environment Variables

The `.env` file has been created with a template DATABASE_URL. You need to update it with your actual database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/movie_system_db?schema=public"
```

Replace:
- `username`: Your PostgreSQL username (default is often `postgres`)
- `password`: Your PostgreSQL password
- `localhost:5432`: Your PostgreSQL host and port (5432 is the default)
- `movie_system_db`: Your desired database name

### 2. Create Database

Before running Prisma commands, create the database:

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create the database
CREATE DATABASE movie_system_db;

-- Grant privileges (if needed)
GRANT ALL PRIVILEGES ON DATABASE movie_system_db TO your_username;
```

### 3. Run Prisma Commands

Once your database is set up and the `.env` file is configured:

```bash
# Generate Prisma Client
npm run db:generate

# Push the schema to your database
npm run db:push

# Or use migrations (recommended for production)
npm run db:migrate
```

### 4. Available Scripts

- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:generate` - Generate Prisma Client
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Troubleshooting

### Common Issues

1. **Connection refused**: Make sure PostgreSQL is running
2. **Authentication failed**: Check username/password in .env
3. **Database does not exist**: Create the database first using the SQL commands above
4. **Permission denied**: Make sure your user has proper permissions

### Testing Connection

You can test your database connection with:

```bash
npx prisma db pull
```

This will attempt to connect and introspect your database.

## Database Schema

The current schema includes models for:
- Movies (title, description, genre, ratings, etc.)
- Users (user accounts)
- Reviews (movie reviews by users)
- Theaters (cinema locations)
- Showtimes (movie screening times)
- Bookings (ticket reservations)

## Next Steps

1. Configure your database credentials in `.env`
2. Create the database in PostgreSQL
3. Run `npm run db:push` to create the tables
4. Start building your movie system application!