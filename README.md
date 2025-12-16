# ReelsPro - Video Reel Sharing Platform

A modern video reel sharing platform built with Next.js, ImageKit, NextAuth, and MongoDB. Upload, manage, and share your video reels with the world.

## Features

- ✅ **User Authentication** - Email/password, Google OAuth, and GitHub OAuth
- ✅ **Video Upload** - Upload videos and thumbnails using ImageKit CDN
- ✅ **Zod Validation** - Comprehensive form and API validation
- ✅ **Modern UI** - Beautiful gradient design with smooth animations
- ✅ **Responsive Design** - Works perfectly on all devices
- ✅ **Secure** - Protected routes and API endpoints

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or Atlas)
- ImageKit account
- Google OAuth credentials (optional)
- GitHub OAuth credentials (optional)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# MongoDB
MONGODB_URI=your-mongodb-connection-string

# ImageKit
NEXT_PUBLIC_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
NEXT_PUBLIC_URL_ENDPOINT=your-imagekit-url-endpoint

# OAuth (Optional but recommended)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/     # NextAuth configuration
│   │   │   ├── imagekit-auth/     # ImageKit upload auth
│   │   │   └── register/          # User registration
│   │   └── videos/                # Video CRUD operations
│   ├── components/                # React components
│   ├── dashboard/                 # Dashboard page
│   ├── login/                     # Login page
│   ├── register/                  # Registration page
│   ├── upload/                    # Upload page
│   └── page.tsx                   # Home page
├── lib/
│   ├── auth.ts                    # NextAuth config
│   ├── db.ts                      # MongoDB connection
│   └── validations.ts             # Zod schemas
└── models/
    ├── User.ts                    # User model
    └── Video.ts                    # Video model
```

## Key Features Implemented

### Authentication
- Email/password authentication with bcrypt hashing
- Google OAuth integration
- GitHub OAuth integration
- Protected routes with middleware

### Validation
- Zod schemas for all forms
- Client-side and server-side validation
- Detailed error messages

### Video Management
- Upload videos and thumbnails to ImageKit
- View all uploaded reels
- Responsive video player

### UI/UX
- Modern gradient design
- Smooth animations and transitions
- Responsive layout
- Custom scrollbars
- Toast notifications

## Technologies Used

- **Next.js 15** - React framework
- **NextAuth.js** - Authentication
- **MongoDB** - Database
- **ImageKit** - Video/CDN hosting
- **Zod** - Schema validation
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Lucide React** - Icons

## License

MIT
