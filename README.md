# E-Learning Platform - Angular 20 + TailwindCSS

A modern, scalable E-Learning platform built with Angular 20 (Standalone Components) and TailwindCSS, featuring multi-language support (EN/AR), role-based authentication, and a responsive UI matching Figma designs.

## 🚀 Features

- **Angular 20** with Standalone Components
- **TailwindCSS** for responsive, utility-first styling
- **JWT Authentication** with Refresh Token Rotation
- **Multi-language Support** (English/Arabic with RTL)
- **Role-Based Access Control** (Admin, Instructor, Student)
- **Clean Architecture** with feature-based structure
- **Lazy Loading** for optimal performance
- **Mobile-First Responsive Design**
- **Accessibility (a11y)** compliant
- **Mock API** with JSON Server for development

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI v20

## 🛠️ Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd elearning-platform
```

2. **Install dependencies:**
```bash
npm install
```

3. **Install Angular CLI globally (if not already installed):**
```bash
npm install -g @angular/cli@20
```

## 🏃 Running the Application

### Development Server
```bash
npm start
```
Navigate to `http://localhost:4200/`

### Development with Mock API
```bash
npm run start:mock
```
This runs both the Angular app and JSON Server mock API concurrently.

### Mock API Only
```bash
npm run mock-api
```
API available at `http://localhost:3001`

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --code-coverage
```

## 🏗️ Build

```bash
# Development build
npm run build

# Production build
npm run build:prod
```

Build artifacts will be stored in the `dist/` directory.

## 📁 Project Structure

```
elearning-platform/
├── src/
│   ├── app/
│   │   ├── core/                    # Singleton services, guards, interceptors
│   │   │   ├── auth/
│   │   │   │   ├── guards/
│   │   │   │   ├── interceptors/
│   │   │   │   └── services/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── features/                # Feature modules (lazy loaded)
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── forgot-password/
│   │   │   ├── dashboard/
│   │   │   │   ├── admin/
│   │   │   │   ├── instructor/
│   │   │   │   └── student/
│   │   │   ├── courses/
│   │   │   ├── profile/
│   │   │   └── settings/
│   │   ├── shared/                  # Shared components, directives, pipes
│   │   │   ├── components/
│   │   │   ├── directives/
│   │   │   └── pipes/
│   │   ├── layout/                  # Layout components
│   │   │   ├── header/
│   │   │   ├── sidebar/
│   │   │   └── footer/
│   │   └── app.component.ts         # Root component
│   ├── assets/                      # Static assets
│   │   ├── i18n/                   # Translation files
│   │   ├── images/
│   │   └── fonts/
│   ├── environments/                # Environment configurations
│   └── styles.scss                  # Global styles
├── public/                          # Public assets
├── db.json                          # Mock API data
└── README.md
```

## 🔐 Authentication

The application implements JWT authentication with refresh token rotation:

- **Access Token**: Short-lived (15 minutes), stored in memory
- **Refresh Token**: Stored in localStorage (development) or httpOnly cookie (production)
- **Auto-refresh**: Automatically refreshes tokens before expiration
- **Secure**: XSS and CSRF protection considerations

### Demo Credentials

```
Admin:
  Email: admin@elearning.com
  Password: Admin@123

Instructor:
  Email: instructor@elearning.com
  Password: Instructor@123

Student:
  Email: student@elearning.com
  Password: Student@123
```

## 🌐 Internationalization (i18n)

The application supports English and Arabic with RTL layout:

```typescript
// Switch language
this.translateService.use('ar'); // Arabic
this.translateService.use('en'); // English
```

Translation files are located in `src/assets/i18n/`.

## 👥 User Roles

### Admin
- Full system access
- User management
- Course management
- Analytics dashboard

### Instructor
- Course creation and management
- Student progress tracking
- Content upload
- Assignment grading

### Student
- Course enrollment
- Content viewing
- Assignment submission
- Progress tracking

## 🎨 Styling Guidelines

The application uses TailwindCSS with a custom theme matching the Figma design:

- **Primary Color**: Blue shades
- **Secondary Color**: Purple shades
- **Font Family**: Inter (Latin), Tajawal (Arabic)
- **Responsive Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)

## 📱 Responsive Design

The application is mobile-first and fully responsive:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔧 Configuration

### Environment Variables

Edit `src/environments/environment.ts` and `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3001',
  apiTimeout: 30000,
  tokenKey: 'access_token',
  refreshTokenKey: 'refresh_token'
};
```

## 🚢 Deployment

### Build for Production
```bash
npm run build:prod
```

### Deploy to Azure/AWS/etc.
The `dist/elearning-platform` folder contains static files that can be deployed to any web server or cloud platform.

#### Azure Static Web Apps
1. Push code to GitHub
2. Create Azure Static Web App
3. Configure build: `npm run build:prod`
4. Output directory: `dist/elearning-platform`

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist/elearning-platform
```

## 📦 Scripts Reference

- `npm start` - Start development server
- `npm run start:mock` - Start with mock API
- `npm run build` - Build for development
- `npm run build:prod` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Run linting
- `npm run format` - Format code with Prettier
- `npm run mock-api` - Start JSON Server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Style

This project uses:
- **Prettier** for code formatting
- **ESLint** for linting
- **Angular Style Guide** for best practices

Run `npm run format` before committing.

## 🐛 Known Issues

- Refresh token rotation is simulated with localStorage in development
- For production, implement httpOnly cookies on backend

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Development Team

Built with ❤️ by the E-Learning Platform Team

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Email: support@elearning.com

---

**Happy Learning! 🎓**
