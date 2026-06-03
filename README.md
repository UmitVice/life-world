# 🏡 Life World - Real Estate Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Mongoose](https://img.shields.io/badge/Mongoose-8-green)](https://mongoosejs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan)](https://tailwindcss.com/)

A modern and user-friendly **Real Estate Platform** where users can browse, filter, and bookmark property listings.

---

## ✨ Features

### 🎯 Core Features
- ✅ Detailed property listing display
- ✅ Property search and filtering system
- ✅ Bookmark functionality for saved properties
- ✅ Responsive design (mobile-friendly)
- ✅ Dark/Light mode support

### 🔐 Authentication & Security
- ✅ User registration (Sign up)
- ✅ User login
- ✅ Secure password hashing with bcrypt
- ✅ JWT-based session management
- ✅ NextAuth v4 integration

### 🎨 UI/UX Design
- ✅ Modern design with TailwindCSS
- ✅ Smooth animations and transitions
- ✅ Theme switching support
- ✅ User-friendly error messages and feedback

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 20.x or higher
Yarn package manager
MongoDB (local or MongoDB Atlas)
```

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/UmitVice/life-world.git
   cd life-world
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   ```

3. **Set Up MongoDB**
   - Local MongoDB: `docker run --name mongo -p 27017:27017 -d mongo`
   - Or use MongoDB Atlas with your connection string

4. **Create Environment Variables**
   
   Create a `.env` file in the project root:
   ```bash
   # .env
   
   MONGODB_URI=mongodb://localhost:27017/lifeworld
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-change-in-production-123456789
   JWT_SECRET=your-jwt-secret-key-change-in-production-xyz123456789
   ```

5. **Start Development Server**
   ```bash
   yarn dev
   ```

6. **Open in Browser**
   ```
   http://localhost:3000
   ```

---

## 📁 Project Structure

```
life-world/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── auth/                 # Authentication routes (NextAuth)
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── properties/               # Property listing pages
│   ├── terms/                    # Terms of Service
│   └── page.tsx                  # Home page
├── components/                   # React Components
│   ├── AuthProvider/             # Authentication provider
│   ├── Hero/                     # Hero section components
│   ├── PropertyDetails/          # Property detail components
│   ├── PropertyPage/             # Property page layout
│   ├── InfoBoxes/                # Information boxes
│   ├── Navbar/                   # Navigation bar
│   └── Footer/                   # Footer component
├── models/                       # Mongoose Models
│   ├── User.ts                   # User schema with password hashing
│   └── Property.ts               # Property schema
├── config/                       # Configuration Files
│   └── database.ts               # MongoDB connection setup
├── utils/                        # Utility Functions
│   └── authOptions.ts            # NextAuth configuration
└── public/                       # Static Assets
```

---

## 🔧 Configuration

### Authentication Setup

Authentication is configured in `components/AuthProvider/authOptions.ts`:

```typescript
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // User authentication logic with bcrypt
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  }
};
```

### Database Connection

Database configuration is located in `config/database.ts`:

```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lifeworld';

// MongoDB connection logic with error handling
```

---

## 🛠️ Technologies Used

| Technology | Version | Description |
|------------|---------|-------------|
| **Next.js** | 14.x | React framework for production |
| **TypeScript** | 5.x | Type-safe JavaScript development |
| **React** | 19.x | UI library and component system |
| **TailwindCSS** | 3.x | Utility-first CSS framework |
| **Mongoose** | 7.x | MongoDB Object Data Modeling |
| **NextAuth.js** | 4.x | Authentication solution for Next.js |
| **bcryptjs** | 3.x | Password hashing library |

---

## 📝 Development Guidelines

### Adding New Features

1. Create new component: `components/NewComponent/index.tsx`
2. Add API route: `app/api/route.ts`
3. Update models: `models/Property.ts` or `models/User.ts`

### Testing Commands

```bash
# Run linter
yarn lint

# Build for production
yarn build

# Start production server
yarn start
```

---

## 🔒 Security Best Practices

- All passwords are hashed using bcrypt before storage
- JWT tokens provide secure session management
- Environment variables protect sensitive configuration
- Input validation and sanitization implemented

### Important Security Notes:
```bash
# Never commit .env to git!
git checkout .env
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Contributors

- **Umit Vice** - [UmitVice](https://github.com/UmitVice)

---

## 📧 Contact & Support

Have questions or suggestions?
- GitHub Issues: https://github.com/UmitVice/life-world/issues
- Email: contact@lifeworld.com

---

**🎉 Happy Coding! 🚀**
