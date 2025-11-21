# E-Learning Platform - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

This guide will help you get the E-Learning platform up and running quickly.

### Prerequisites Check
```bash
node --version    # Should be v18 or higher
npm --version     # Should be v9 or higher
```

### Step 1: Install Dependencies (2 minutes)
```bash
cd "d:\E learning Frontend"
npm install
```

This will install:
- Angular 20 framework
- TailwindCSS for styling
- Translation libraries (@ngx-translate)
- JWT decode library
- Development tools (json-server, prettier, etc.)

### Step 2: Start Development (1 minute)

**Option A: App Only**
```bash
npm start
```
Open http://localhost:4200

**Option B: App + Mock API (Recommended)**
```bash
npm run start:mock
```
- App: http://localhost:4200
- Mock API: http://localhost:3001

### Step 3: Login with Demo Accounts

The application comes with pre-configured demo accounts:

**Admin Account**
- Email: `admin@elearning.com`
- Password: `Admin@123`
- Access: Full platform management

**Instructor Account**
- Email: `instructor@elearning.com`
- Password: `Instructor@123`
- Access: Course creation and management

**Student Account**
- Email: `student@elearning.com`
- Password: `Student@123`
- Access: Course enrollment and learning

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                      # Singleton services, guards, models
│   │   ├── auth/                  # Authentication logic
│   │   │   ├── guards/            # Route guards (auth, role)
│   │   │   ├── interceptors/      # HTTP interceptors
│   │   │   └── services/          # Auth service
│   │   ├── models/                # TypeScript interfaces
│   │   └── services/              # Core services
│   ├── features/                  # Lazy-loaded feature modules
│   │   ├── auth/                  # Login, Register
│   │   ├── dashboard/             # Dashboard (role-based views)
│   │   ├── courses/               # Course list, detail, creation
│   │   └── profile/               # User profile
│   ├── layout/                    # Layout components
│   │   ├── header/                # Top navigation
│   │   └── main-layout/           # Main layout wrapper
│   ├── shared/                    # Reusable components
│   │   └── components/            # Button, Input, Card, etc.
│   ├── app.component.ts           # Root component
│   ├── app.routes.ts              # Route configuration
│   └── app.config.ts              # App configuration
├── assets/
│   └── i18n/                      # Translation files (en.json, ar.json)
├── environments/                  # Environment configs
└── styles.scss                    # Global styles + Tailwind
```

## 🎨 Key Features Implemented

### ✅ Authentication & Authorization
- JWT access token (in-memory)
- Refresh token rotation (localStorage simulation)
- Role-based guards (Admin, Instructor, Student)
- Auto token refresh on 401 errors
- Secure logout

### ✅ Multi-Language Support
- English (EN) and Arabic (AR)
- RTL layout for Arabic
- Language switcher in header
- Translation files in `src/assets/i18n/`

### ✅ Responsive Design
- Mobile-first approach
- TailwindCSS utility classes
- Custom theme matching Figma
- Responsive navigation
- Touch-friendly UI

### ✅ UI Components
- Button (primary, secondary, outline, ghost)
- Input (with validation)
- Card (with hover effects)
- Avatar (with status indicators)
- Badge (color variants)
- Loader (spinner)
- Toast notifications

### ✅ Role-Based Dashboards
- **Admin**: System stats, user management, course oversight
- **Instructor**: Course management, student tracking
- **Student**: Enrolled courses, progress tracking

## 🛠️ Development Commands

```bash
# Development server
npm start

# With mock API
npm run start:mock

# Build for production
npm run build:prod

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Mock API only
npm run mock-api
```

## 🔧 Configuration

### API Endpoint
Edit `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001',  // Change this for real backend
  ...
};
```

### Tailwind Theme
Edit `tailwind.config.js` to customize colors, fonts, spacing:
```javascript
theme: {
  extend: {
    colors: {
      primary: { ... },  // Customize primary brand color
      secondary: { ... }, // Customize secondary color
    }
  }
}
```

### Translation
Add new keys in `src/assets/i18n/en.json` and `ar.json`:
```json
{
  "myNewKey": "My Translation"
}
```

Use in templates:
```html
{{ 'myNewKey' | translate }}
```

## 🌐 Mock API (JSON Server)

The `db.json` file contains sample data:
- Users (admin, instructor, student)
- Courses with full details
- Enrollments and progress tracking
- Assignments and submissions
- Notifications

### Available Endpoints
```
GET    /users
GET    /users/:id
GET    /courses
GET    /courses/:id
POST   /courses
PATCH  /courses/:id
DELETE /courses/:id
GET    /enrollments?userId=:id
POST   /enrollments
```

## 🔐 Security Notes

**Development Mode:**
- Refresh tokens stored in localStorage (for demo only)
- Mock JWT tokens generated client-side

**Production Recommendations:**
- Use httpOnly cookies for refresh tokens
- Implement real backend JWT generation
- Add CSRF protection
- Use HTTPS only
- Implement rate limiting

## 🧪 Testing the Application

1. **Test Authentication:**
   - Login with different roles
   - Verify role-based access
   - Test logout functionality

2. **Test Multi-Language:**
   - Click language toggle in header
   - Verify RTL layout for Arabic
   - Check all translations load correctly

3. **Test Routing:**
   - Navigate between pages
   - Try accessing restricted routes
   - Verify lazy loading works

4. **Test Responsive Design:**
   - Resize browser window
   - Test on mobile devices
   - Verify navigation adapts

## 📚 Learning Resources

- **Angular 20**: https://angular.dev
- **TailwindCSS**: https://tailwindcss.com
- **RxJS**: https://rxjs.dev
- **TypeScript**: https://www.typescriptlang.org

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 4200
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Angular cache
rm -rf .angular
ng build
```

## 🚀 Next Steps

1. **Connect to Real Backend:**
   - Update `environment.ts` with API URL
   - Remove mock JWT generation
   - Implement real API calls

2. **Enhance Features:**
   - Add video player for lessons
   - Implement assignment submission
   - Add real-time chat
   - Create analytics dashboard

3. **Improve UX:**
   - Add loading skeletons
   - Implement infinite scroll
   - Add animations
   - Improve error handling

4. **Deploy:**
   - Build production bundle
   - Deploy to Azure/AWS/Netlify
   - Configure CI/CD pipeline

## 📞 Support

For issues or questions:
- Check the README.md
- Review Angular documentation
- Check TailwindCSS documentation

---

**Happy Coding! 🎉**
