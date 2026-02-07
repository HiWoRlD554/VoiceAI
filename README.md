# VoiceAI - Voice Assistant Dashboard

A modern React application for managing voice AI assistants with Supabase authentication and Google OAuth integration.

## 🚀 Features

- **Authentication**: Secure login with Google OAuth via Supabase
- **Protected Routes**: Dashboard and other protected pages require authentication
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first responsive layout

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth with Google OAuth
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: TanStack Query
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- A Supabase project with Google OAuth configured

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd VoiceAI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of your project:

```bash
cp .env.example .env.local
```

Add your Supabase configuration:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Configure Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key from Settings > API

2. **Set Up Google OAuth**
   - In your Supabase project, go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials:
     - Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
     - Create a new OAuth 2.0 Client ID
     - Add authorized redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`
   - Save your Google Client ID and Client Secret in Supabase

3. **Update Site URL**
   - In Supabase Settings > Authentication, set:
     - Site URL: `http://localhost:5173` (for development)
     - Redirect URLs: `http://localhost:5173/**`

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   │   └── ProtectedRoute.tsx
│   ├── dashboard/      # Dashboard components
│   ├── landing/        # Landing page components
│   └── ui/            # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx # Authentication context
├── lib/
│   └── supabase.ts    # Supabase client configuration
├── pages/
│   ├── Dashboard.tsx   # Protected dashboard page
│   ├── Index.tsx       # Landing page
│   ├── Login.tsx       # Login page
│   └── NotFound.tsx    # 404 page
└── ...
```

## 🔐 Authentication Flow

1. **Unauthenticated users** are redirected to `/login`
2. **Google OAuth** authentication via Supabase
3. **Protected routes** check authentication status
4. **Session persistence** with automatic token refresh
5. **Sign out** clears local session and redirects to login

## 🛡️ Protected Routes

Routes wrapped with `ProtectedRoute` component require authentication:

- `/dashboard` - Main dashboard (protected)

Public routes:
- `/` - Landing page
- `/login` - Login page

## 🎨 UI Components

The application uses shadcn/ui components for consistent design:

- Cards, buttons, forms, dialogs
- Toast notifications (Sonner)
- Loading states and spinners
- Responsive layouts

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports static sites:

- Netlify
- AWS Amplify
- GitHub Pages
- Railway

## 🔧 Development Tips

### Environment Variables

- Use `.env.local` for local development
- Variables must start with `VITE_` to be exposed to the client
- Never commit `.env.local` to version control

### Authentication Debugging

- Check browser console for auth errors
- Verify Supabase configuration in dashboard
- Ensure redirect URLs match exactly

### Styling

- Use Tailwind CSS classes for styling
- Follow shadcn/ui patterns for consistency
- Components are located in `src/components/ui/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Google OAuth not working:**
- Verify Google OAuth credentials in Supabase
- Check redirect URLs in both Google Console and Supabase
- Ensure Site URL is correctly set in Supabase

**Build errors:**
- Run `npm install` to ensure all dependencies are installed
- Check TypeScript configuration
- Verify all environment variables are set

**Authentication state issues:**
- Clear browser localStorage and cookies
- Check network tab for Supabase API calls
- Verify environment variables are correctly loaded

### Getting Help

- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the [React Router Documentation](https://reactrouter.com/)
- Open an issue in the repository for specific problems
