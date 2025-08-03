# Movie Review System with Authentication

A comprehensive movie review and recommendation system with user authentication, personalized recommendations, and social features.

## Features

### 🔐 Authentication System
- **User Registration**: Complete signup with personal information
- **User Login**: Secure authentication with JWT tokens
- **Profile Management**: Update user preferences and information
- **Protected Routes**: Secure access to authenticated features

### 🎬 Movie Features
- **Personalized Recommendations**: Based on user's preferred genres
- **Movie Details**: Comprehensive information with cast, reviews, and ratings
- **Favorites System**: Save and manage favorite movies
- **Notes & Comments**: Personal notes and public comments on movies

### 👥 Social Features
- **Friend System**: Add and manage friends by username
- **Public Chat**: Community chat for movie enthusiasts
- **Comments**: Public comments on movies with like/dislike functionality

### 🎨 User Experience
- **Genre Selection**: Choose up to 5 preferred movie genres
- **Responsive Design**: Works on all devices
- **Modern UI**: Beautiful interface with smooth animations

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Icons**: Phosphor React
- **API**: TMDB for movie data

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- TMDB API key

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd movie_system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/movie_system"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key"

# TMDB API
NEXT_PUBLIC_TMDB_API_KEY="your-tmdb-api-key"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) View database in Prisma Studio
npx prisma studio
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## User Flow

### 1. Account Creation
1. Visit `/views/auth/signup`
2. Fill in personal information (name, age, email)
3. Create username and password
4. Account created successfully → Redirected to sign in

### 2. Sign In
1. Visit `/views/auth/signin`
2. Enter email and password
3. Successful login → Redirected to genre selection

### 3. Genre Selection
1. Choose up to 5 movie genres you love
2. Save preferences → Redirected to main page
3. Or skip for now → Redirected to main page

### 4. Main Experience
- **Personalized Movies**: See recommendations based on your genres
- **Movie Details**: Click any movie for comprehensive information
- **Favorites**: Add/remove movies from your favorites
- **Social Features**: Add friends, comment, and chat

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update` - Update user profile

### Friends
- `POST /api/auth/friends/add` - Add friend
- `DELETE /api/auth/friends/remove` - Remove friend

## Database Schema

### Users
- Personal information (name, age, email)
- Authentication (username, password)
- Preferences (preferred genres)
- Social (friends list)

### Notes
- Personal movie notes
- Linked to user and movie

### Comments
- Public movie comments
- Like/dislike functionality
- Linked to user and movie

### Messages
- Chat system messages
- System and user messages

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure authentication
- **Input Validation**: Server-side validation
- **Protected Routes**: Authentication required
- **SQL Injection Protection**: Prisma ORM

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.
