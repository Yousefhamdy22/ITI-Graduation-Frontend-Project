# 🚀 QUICK START - E-Learning Platform

## ✅ Setup Complete!

Your E-Learning platform is ready to run. Follow these simple steps:

---

## 📝 Step 1: Start the Application

Open PowerShell in this directory and run:

```powershell
npm run start:mock
```

This will start:
- ✅ Angular development server on http://localhost:4200
- ✅ Mock API server on http://localhost:3001

**Alternative (App only):**
```powershell
npm start
```

---

## 🔑 Step 2: Login with Demo Account

Navigate to http://localhost:4200 and login with:

### 👨‍💼 Admin Account
- **Email:** admin@elearning.com
- **Password:** Admin@123
- **Access:** Full platform management, user management, analytics

### 👨‍🏫 Instructor Account
- **Email:** instructor@elearning.com
- **Password:** Instructor@123
- **Access:** Create courses, manage students, grade assignments

### 🎓 Student Account
- **Email:** student@elearning.com
- **Password:** Student@123
- **Access:** Enroll in courses, track progress, submit assignments

---

## 🎯 What to Try

1. **Test Authentication**
   - Login with different roles
   - See role-based dashboard differences
   - Test logout and re-login

2. **Explore Features**
   - Browse courses catalog
   - View course details
   - Check your profile
   - Navigate different sections

3. **Test Multi-Language**
   - Click the language toggle in header (EN ⟷ ع)
   - Watch the layout switch to RTL for Arabic
   - All content translates automatically

4. **Test Responsive Design**
   - Resize your browser window
   - Open on mobile device
   - Navigation adapts to screen size

---

## 📁 Project Structure

```
src/app/
├── core/              # Services, guards, models
├── features/          # Main features (auth, dashboard, courses)
├── layout/            # Header, footer, layouts
└── shared/            # Reusable components
```

---

## 🛠️ Useful Commands

```powershell
# Start with mock API (recommended)
npm run start:mock

# Start app only
npm start

# Build for production
npm run build:prod

# Run tests
npm test

# Format code
npm run format

# Lint code
npm run lint
```

---

## 📚 Documentation

- **README.md** - Full project documentation
- **SETUP_GUIDE.md** - Detailed setup and troubleshooting
- **PROJECT_SUMMARY.md** - Complete feature list and architecture

---

## 🌟 Key Technologies

- ⚡ **Angular 20** - Modern web framework with Standalone Components
- 🎨 **TailwindCSS** - Utility-first CSS framework
- 🔐 **JWT Auth** - Secure authentication with refresh tokens
- 🌍 **i18n** - English + Arabic with RTL support
- 📱 **Responsive** - Mobile-first design

---

## 🐛 Troubleshooting

### Port Already in Use?
```powershell
# Find and kill process
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

### Build Errors?
```powershell
# Clear Angular cache
Remove-Item -Recurse -Force .angular
npm start
```

### Need Clean Install?
```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

---

## 📞 Need Help?

1. Check **SETUP_GUIDE.md** for detailed instructions
2. Review **PROJECT_SUMMARY.md** for feature documentation
3. Check Angular docs: https://angular.dev
4. Check TailwindCSS docs: https://tailwindcss.com

---

## 🎉 Happy Learning!

Your E-Learning platform is production-ready with:
✅ Complete authentication system
✅ Role-based access control
✅ Multi-language support (EN/AR)
✅ Responsive design
✅ Reusable UI components
✅ Mock API for development
✅ Clean architecture
✅ TypeScript strict mode
✅ Best practices implemented

**Enjoy building amazing features! 🚀**
