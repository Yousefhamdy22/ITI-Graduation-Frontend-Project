# 🎯 E-Learning Platform - Complete CLI Commands Reference

This document contains all commands needed to set up, run, and manage the E-Learning platform.

---

## 📦 Initial Setup

### 1. Navigate to Project Directory
```powershell
cd "d:\E learning Frontend"
```

### 2. Install Dependencies
```powershell
npm install
```

**Expected Output:** ✅ All packages installed successfully (takes 2-5 minutes)

### 3. Run Setup Script (Optional)
```powershell
.\setup.ps1
```

---

## 🚀 Development Commands

### Start Development Server (Recommended)
```powershell
npm run start:mock
```
- Starts Angular app on http://localhost:4200
- Starts Mock API on http://localhost:3001
- Both run concurrently

### Start App Only
```powershell
npm start
```
- Only Angular development server
- No mock API
- Opens browser automatically

### Start Mock API Only
```powershell
npm run mock-api
```
- JSON Server on http://localhost:3001
- Useful for API testing

---

## 🏗️ Build Commands

### Development Build
```powershell
npm run build
```
- Creates unoptimized build
- Source maps included
- Output: `dist/elearning-platform`

### Production Build
```powershell
npm run build:prod
```
- Optimized for production
- Minified and tree-shaken
- No source maps
- Output: `dist/elearning-platform`

### Watch Mode (Auto-rebuild)
```powershell
npm run watch
```
- Rebuilds on file changes
- Useful for debugging build issues

---

## 🧪 Testing Commands

### Run Unit Tests
```powershell
npm test
```
- Opens Karma test runner
- Runs all spec files
- Watch mode enabled

### Run Tests with Coverage
```powershell
npm test -- --code-coverage
```
- Generates coverage report
- Output: `coverage/` directory
- Open `coverage/index.html` to view

### Run Tests Once (CI Mode)
```powershell
npm test -- --no-watch --code-coverage
```
- Single run (no watch mode)
- Exits after completion
- Good for CI/CD pipelines

---

## 🎨 Code Quality Commands

### Lint TypeScript Files
```powershell
npm run lint
```
- Checks TypeScript code style
- Reports ESLint errors
- No auto-fix

### Lint and Auto-Fix
```powershell
npm run lint -- --fix
```
- Fixes auto-fixable issues
- Reports remaining issues

### Format Code
```powershell
npm run format
```
- Formats all TS, HTML, CSS files
- Uses Prettier rules
- Overwrites files

### Check Formatting
```powershell
npx prettier --check "src/**/*.{ts,html,css,scss}"
```
- Checks if files are formatted
- Doesn't modify files
- Returns exit code for CI

---

## 🌐 Angular CLI Commands

### Generate New Component
```powershell
ng generate component features/my-feature/my-component
# or shorthand
ng g c features/my-feature/my-component
```

### Generate New Service
```powershell
ng generate service core/services/my-service
# or shorthand
ng g s core/services/my-service
```

### Generate New Guard
```powershell
ng generate guard core/auth/guards/my-guard
```

### Generate New Pipe
```powershell
ng generate pipe shared/pipes/my-pipe
```

### Generate New Directive
```powershell
ng generate directive shared/directives/my-directive
```

### Generate New Interface
```powershell
ng generate interface core/models/my-model
```

---

## 📊 JSON Server Commands

### Start JSON Server
```powershell
json-server --watch db.json --port 3001
```

### Start with Custom Routes
```powershell
json-server --watch db.json --port 3001 --routes routes.json
```

### Start with CORS Enabled
```powershell
json-server --watch db.json --port 3001 --no-cors
```

---

## 🔧 Maintenance Commands

### Clear Node Modules and Reinstall
```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### Clear Angular Cache
```powershell
Remove-Item -Recurse -Force .angular
```

### Clear All Build Artifacts
```powershell
Remove-Item -Recurse -Force .angular, dist, coverage
```

### Update Dependencies
```powershell
# Check for updates
npm outdated

# Update all to latest within semver
npm update

# Update Angular to latest
ng update @angular/core @angular/cli
```

---

## 📦 Package Management

### Install New Package
```powershell
npm install package-name
```

### Install Dev Dependency
```powershell
npm install --save-dev package-name
```

### Uninstall Package
```powershell
npm uninstall package-name
```

### List Installed Packages
```powershell
npm list --depth=0
```

### Check for Security Vulnerabilities
```powershell
npm audit

# Fix automatically
npm audit fix
```

---

## 🌍 Environment-Specific Builds

### Build for Development Environment
```powershell
ng build --configuration development
```

### Build for Production Environment
```powershell
ng build --configuration production
```

### Serve with Specific Environment
```powershell
ng serve --configuration production
```

---

## 🐛 Debugging Commands

### Verbose Build
```powershell
ng build --verbose
```

### Analyze Bundle Size
```powershell
ng build --stats-json
npx webpack-bundle-analyzer dist/elearning-platform/stats.json
```

### Check TypeScript Errors Only
```powershell
npx tsc --noEmit
```

### Check Angular Version
```powershell
ng version
```

---

## 🚢 Deployment Commands

### Build for Azure Static Web Apps
```powershell
npm run build:prod
# Output: dist/elearning-platform
```

### Build for Netlify
```powershell
npm run build:prod
# Set build command in netlify.toml: npm run build:prod
# Set publish directory: dist/elearning-platform
```

### Build for GitHub Pages
```powershell
ng build --configuration production --base-href /your-repo-name/
```

---

## 📝 Useful Shortcuts

### Open Project in VS Code
```powershell
code .
```

### Open in Browser
```powershell
start http://localhost:4200
```

### Kill Process on Port
```powershell
# Find process
netstat -ano | findstr :4200

# Kill process
taskkill /PID <PID> /F
```

---

## 🔍 Verification Commands

### Check Node Version
```powershell
node --version
# Should be: v18.x or higher
```

### Check npm Version
```powershell
npm --version
# Should be: v9.x or higher
```

### Check Angular CLI Version
```powershell
ng version
# Should show Angular 20.x
```

### Check Project Dependencies
```powershell
npm list @angular/core
npm list tailwindcss
```

---

## 📚 Learning Commands

### View Angular Documentation
```powershell
ng doc
```

### Get Help for Command
```powershell
ng help
ng build --help
ng serve --help
```

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Start Dev | `npm run start:mock` |
| Build Prod | `npm run build:prod` |
| Test | `npm test` |
| Lint | `npm run lint` |
| Format | `npm run format` |
| New Component | `ng g c path/name` |
| New Service | `ng g s path/name` |
| Clean Install | `rm -rf node_modules; npm i` |

---

## 🚨 Common Issues & Solutions

### Port 4200 in use
```powershell
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

### Module not found
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### Build fails
```powershell
Remove-Item -Recurse -Force .angular
npm run build
```

### TypeScript errors
```powershell
npx tsc --noEmit
# Fix reported errors
```

---

## 📞 Support Resources

- **Angular Docs**: https://angular.dev
- **TailwindCSS Docs**: https://tailwindcss.com
- **TypeScript Docs**: https://www.typescriptlang.org
- **RxJS Docs**: https://rxjs.dev

---

**Happy Coding! 🎉**
