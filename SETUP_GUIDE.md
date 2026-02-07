# VoiceAI - Setup Guide & Implementation Changes

This document provides comprehensive setup instructions and details about all recent changes to the VoiceAI application.

## 🚀 Recent Changes Overview

### ✅ Completed Features

1. **Enhanced Authentication System**
   - Google OAuth integration with Supabase
   - Email/password authentication
   - Protected routes with automatic redirects
   - User profile management
   - Login/logout functionality

2. **Supabase Database Integration**
   - Complete database schema with proper relationships
   - Row-level security policies
   - Real-time data synchronization
   - File storage integration

3. **Lead Management System**
   - Excel/CSV file upload and processing
   - Real-time preview of imported data
   - Database storage with validation
   - File type and size validation

4. **Knowledge Base Management**
   - Document upload (PDF, DOC, DOCX, TXT)
   - Manual knowledge entry with titles
   - File storage in Supabase Storage
   - Download and delete functionality

5. **UI/UX Improvements**
   - Theme-matched login page
   - Home button navigation
   - Glass morphism design
   - Loading states and error handling

## 📋 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project
- Git for version control

### Step 1: Database Setup

1. **Create Supabase Project**
   ```bash
   # Go to https://supabase.com
   # Create new project
   # Note project URL and anon key
   ```

2. **Run Database Schema**
   - Open the Supabase SQL Editor
   - Copy and paste the entire content from `database/schema.sql`
   - Execute the SQL script

3. **Configure Storage**
   ```sql
   -- The schema automatically creates the storage bucket
   -- Verify it exists in Storage section
   ```

4. **Set Up Authentication**
   - Go to Authentication > Providers
   - Enable Google provider
   - Add Google OAuth credentials
   - Configure redirect URLs

### Step 2: Environment Configuration

1. **Create Environment File**
   ```bash
   cp .env.example .env.local
   ```

2. **Add Supabase Credentials**
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Configure Google OAuth**
   - Get credentials from Google Cloud Console
   - Add authorized redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`
   - Update Site URL in Supabase Settings

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🗄️ Database Schema

### Core Tables

#### `user_profiles`
- Stores user account information and credits
- Automatically created on user signup
- Tracks subscription tier and usage

#### `leads`
- Customer lead information
- Status tracking (new, contacted, interested, etc.)
- User-isolated data

#### `knowledge_base`
- AI training data
- Supports both document uploads and manual entries
- File storage integration

#### `campaigns`
- Calling campaign configurations
- Script and voice settings
- Active/inactive status management

#### `call_results`
- Call outcome tracking
- Duration, transcription, sentiment analysis
- Campaign and lead relationships

### Security Features

- **Row Level Security**: Users can only access their own data
- **Storage Policies**: Secure file upload/download
- **Authentication**: JWT-based session management
- **Input Validation**: Client and server-side validation

## 📁 File Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthHeader.tsx      # Profile dropdown and logout
│   │   └── ProtectedRoute.tsx # Route protection wrapper
│   ├── dashboard/
│   │   ├── LeadUploadSection.tsx    # Excel/CSV upload
│   │   ├── KnowledgeBaseSection.tsx # Document/manual knowledge
│   │   ├── CampaignSettings.tsx     # Campaign configuration
│   │   └── CallResultsSection.tsx    # Call outcome display
│   └── ui/                       # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx            # Authentication state management
├── lib/
│   ├── database/
│   │   ├── types.ts              # TypeScript type definitions
│   │   └── services.ts           # Supabase CRUD operations
│   └── supabase.ts              # Supabase client configuration
├── pages/
│   ├── Login.tsx                 # Authentication page
│   ├── Dashboard.tsx              # Main dashboard
│   ├── Profile.tsx               # User profile management
│   └── Index.tsx                 # Landing page
└── database/
    └── schema.sql                 # Complete database schema
```

## 🔧 Key Services

### Authentication Service
```typescript
// Google OAuth
await signInWithGoogle()

// Email/Password
await signInWithEmail(email, password)
await signUpWithEmail(email, password)

// Session Management
await signOut()
```

### Lead Management
```typescript
// Upload Excel/CSV
await leadsService.uploadExcel(file, userId)

// CRUD Operations
await leadsService.getAll(userId)
await leadsService.create(leadData)
await leadsService.update(id, updates)
await leadsService.delete(id)
```

### Knowledge Base
```typescript
// Document Upload
await knowledgeBaseService.uploadDocument(file, userId, title)

// Manual Entry
await knowledgeBaseService.createManual(userId, title, content)

// File Management
await knowledgeBaseService.getAll(userId)
await knowledgeBaseService.delete(id)
```

## 🎨 UI Components

### Authentication
- **Login Page**: Tabbed interface (Email/Google)
- **Profile Dropdown**: User menu with avatar
- **Protected Routes**: Automatic authentication checks

### Dashboard Features
- **Lead Upload**: Drag-and-drop file interface
- **Knowledge Base**: Document upload and manual entry
- **Campaign Settings**: Configuration management
- **Call Results**: Real-time outcome display

## 🔒 Security Implementation

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Automatic user_id filtering

### Storage Security
- Private file storage buckets
- User-specific file access
- Secure upload/download URLs

### Input Validation
- File type validation
- Size limits enforced
- Data sanitization

## 📊 Data Flow

1. **User Authentication**
   - Login via Google OAuth or Email
   - JWT token stored in session
   - User profile auto-created

2. **Data Upload**
   - Files validated client-side
   - Processed and stored in Supabase
   - Real-time UI updates

3. **Knowledge Management**
   - Documents stored in Supabase Storage
   - Manual entries in database
   - AI integration ready

4. **Campaign Execution**
   - Settings stored in database
   - Lead targeting from uploaded lists
   - Results tracked in real-time

## 🚨 Troubleshooting

### Common Issues

**Authentication Errors**
- Verify Supabase URL and keys in .env.local
- Check Google OAuth configuration
- Ensure redirect URLs match

**Database Connection**
- Confirm schema was executed
- Check RLS policies
- Verify user permissions

**File Upload Issues**
- Check file size limits
- Validate file formats
- Ensure storage bucket exists

**Development Server**
- Clear node_modules and reinstall
- Check for port conflicts
- Verify environment variables

### Debug Mode

Enable debug logging:
```typescript
// In browser console
localStorage.setItem('debug', 'true')
```

## 🔄 Migration from Mock Data

### Before Migration
- Mock data stored in `src/data/mockData.ts`
- Static data used for development

### After Migration
- Real data from Supabase
- Dynamic updates and persistence
- User-specific data isolation

### Migration Steps
1. Set up Supabase project
2. Run database schema
3. Update environment variables
4. Test with real data
5. Remove mock data imports

## 📱 Deployment

### Environment Variables
```env
# Production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-key
```

### Build Process
```bash
npm run build
npm run preview
```

### Platform-Specific Notes
- **Vercel**: Add environment variables in dashboard
- **Netlify**: Set environment variables in site settings
- **AWS**: Configure Lambda functions for server-side operations

## 🤝 Contributing Guidelines

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component-based architecture

### Testing
```bash
npm run test
npm run test:watch
```

### Git Workflow
1. Create feature branch
2. Implement changes
3. Add tests
4. Submit pull request
5. Code review and merge

## 📚 Additional Resources

### Documentation
- [Supabase Documentation](https://supabase.com/docs)
- [React Router](https://reactrouter.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

### Support
- Check browser console for errors
- Review network tab for API calls
- Verify Supabase dashboard logs
- Check this README for troubleshooting

---

## 🎯 Quick Start Checklist

- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Environment variables configured
- [ ] Google OAuth set up
- [ ] Dependencies installed
- [ ] Development server running
- [ ] Authentication tested
- [ ] File upload tested
- [ ] Database operations verified

Once all items are checked, your VoiceAI application is ready for development and deployment!
