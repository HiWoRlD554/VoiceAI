# VoiceAI - Voice Assistant Dashboard

A modern React application for managing voice AI assistants with Supabase authentication and real-time data management.

## 🚀 Features

- **Authentication**: Secure login with Google OAuth and Email/Password via Supabase
- **Protected Routes**: Dashboard and other protected pages require authentication
- **Real Database**: Complete Supabase integration replacing mock data
- **Lead Management**: Excel/CSV upload with real-time preview and validation
- **Knowledge Base**: Document upload and manual knowledge entry with AI training
- **Campaign Settings**: Configure calling campaigns with scripts and voice settings
- **Call Results**: Real-time call outcome tracking and analytics
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first responsive layout

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase PostgreSQL with Row Level Security
- **Storage**: Supabase Storage for file uploads
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: TanStack Query
- **Icons**: Lucide React

## 📋 Quick Start

### 📖 **IMPORTANT**: First read the [Setup Guide](./SETUP_GUIDE.md)

The complete setup guide with step-by-step instructions is available in `SETUP_GUIDE.md`. This includes:
- Database schema setup
- Supabase configuration
- Environment variables
- Authentication setup
- Migration from mock data

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase project with authentication configured

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd VoiceAI

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your Supabase credentials to .env.local

# Start development server
npm run dev
```

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   └── ui/            # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx # Authentication context
├── lib/
│   ├── database/
│   │   ├── types.ts    # Database type definitions
│   │   └── services.ts # Supabase CRUD operations
│   └── supabase.ts    # Supabase client configuration
├── pages/
│   ├── Dashboard.tsx   # Protected dashboard page
│   ├── Login.tsx       # Login page
│   ├── Profile.tsx     # User profile page
│   └── Index.tsx       # Landing page
└── database/
    └── schema.sql       # Complete database schema
```

## 🔐 Authentication Flow

1. **User Registration/Login**: Email/password or Google OAuth
2. **Session Management**: Automatic token refresh and persistence
3. **Protected Routes**: Automatic redirect to login for unauthenticated users
4. **Profile Management**: User settings and preferences

## 🗄️ Database Features

### Real Data Management
- **Leads**: Excel/CSV import with validation and preview
- **Knowledge Base**: Document upload and manual entries
- **Campaigns**: Configuration and management
- **Call Results**: Real-time outcome tracking
- **User Profiles**: Credits and subscription management

### Security
- **Row Level Security**: Users can only access their own data
- **Storage Policies**: Secure file upload/download
- **Input Validation**: Client and server-side validation

## 🎨 UI Features

### Authentication
- **Login Page**: Tabbed interface with email and Google options
- **Profile Dropdown**: User menu with avatar and logout
- **Theme Matching**: Consistent design across all pages

### Dashboard Components
- **Lead Upload**: Drag-and-drop interface with file validation
- **Knowledge Base**: Document management and manual entry
- **Campaign Settings**: Script and voice configuration
- **Call Results**: Analytics and outcome display

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
npm test:watch

# Lint code
npm run lint
```

## 🚀 Deployment

### Environment Setup
1. **Supabase Project**: Create and configure database
2. **Authentication**: Set up Google OAuth and email providers
3. **Storage**: Configure file upload buckets
4. **Environment Variables**: Add Supabase credentials

### Platform Deployment
- **Vercel** (Recommended): Connect repository and add environment variables
- **Netlify**: Configure build settings and environment variables
- **AWS Amplify**: Set up static site hosting

## 📚 Documentation

- **[Setup Guide](./SETUP_GUIDE.md)**: Complete setup and configuration instructions
- **[Database Schema](./database/schema.sql)**: Complete SQL schema
- **[Type Definitions](./src/lib/database/types.ts)**: TypeScript interfaces
- **[Service Layer](./src/lib/database/services.ts)**: CRUD operations

## 🔧 Development

### Environment Variables
```env
# Required
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for consistent formatting
- Component-based architecture

## 🆘 Troubleshooting

### Common Issues

**Authentication Problems**
- Verify Supabase configuration in `.env.local`
- Check Google OAuth settings in Supabase dashboard
- Ensure redirect URLs match exactly

**Database Connection**
- Confirm schema was executed in Supabase SQL Editor
- Check Row Level Security policies
- Verify user permissions

**File Upload Issues**
- Check file size limits (25MB for documents, 10MB for leads)
- Validate file formats (PDF, DOC, DOCX, TXT, XLS, XLSX, CSV)
- Ensure storage bucket exists in Supabase

### Getting Help

1. **Check Console**: Browser console for JavaScript errors
2. **Network Tab**: Verify API calls to Supabase
3. **Supabase Logs**: Check authentication and database logs
4. **Setup Guide**: Review [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed steps

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use existing UI components from shadcn/ui
- Test with real Supabase data
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎯 Quick Setup Checklist

- [ ] Read [Setup Guide](./SETUP_GUIDE.md) completely
- [ ] Create Supabase project
- [ ] Execute database schema
- [ ] Configure authentication providers
- [ ] Set up environment variables
- [ ] Install dependencies
- [ ] Test authentication flow
- [ ] Verify file uploads
- [ ] Check database operations

**Ready for Development!** 🚀

For detailed setup instructions, database schema, and implementation details, please refer to the [Setup Guide](./SETUP_GUIDE.md).
