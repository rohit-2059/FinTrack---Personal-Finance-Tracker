# 💰 HisabKitab - Personal Finance Tracker

A comprehensive web application for managing personal finances, tracking expenses and income, and gaining insights into spending habits through interactive visualizations.

## 🌐 Live Demo

**[View Live Application](https://fin-track-personal-finance-tracker-five.vercel.app/login)**

## 📋 About The Project

HisabKitab is a modern, user-friendly personal finance management application that helps users take control of their financial life. Built with React and Firebase, it provides real-time transaction tracking, detailed analytics, and secure cloud storage for all your financial data.

Whether you're tracking daily expenses, monitoring monthly budgets, or analyzing spending patterns, HisabKitab offers an intuitive interface with powerful features to help you make informed financial decisions.

## ✨ Features

### 🔐 Authentication
- **Email/Password Authentication** - Secure user registration and login
- **Google Sign-In** - Quick authentication with Google accounts
- **Protected Routes** - Secure access to user-specific data
- **User Profile Management** - View and manage account details

### 💳 Transaction Management
- **Add Transactions** - Record income and expenses with detailed information
- **Edit/Delete Transactions** - Modify or remove transactions anytime
- **Transaction Categories** - Organize transactions by custom categories
- **Date Tracking** - Track transactions with specific dates
- **Real-time Updates** - Instant synchronization across devices

### 📊 Dashboard & Analytics
- **Financial Overview** - View total income, expenses, and current balance
- **Interactive Charts** - Visualize spending patterns with Chart.js
- **Category Breakdown** - Pie charts showing expense distribution
- **Spending Trends** - Line graphs displaying financial trends over time
- **Summary Cards** - Quick glance at financial health

### 📱 User Experience
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme** - Toggle between themes for comfortable viewing
- **Intuitive Navigation** - Clean sidebar and navbar for easy access
- **Search & Filter** - Find transactions quickly with advanced filtering
- **Export Options** - Download transaction reports (PDF/Excel)

### 🎨 Design & Interface
- **Modern UI** - Clean and professional design with Tailwind CSS
- **Smooth Animations** - Polished user interactions
- **Icon Integration** - Beautiful icons with Lucide React
- **Color-coded Transactions** - Visual distinction between income and expenses

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - Modern UI library with latest features
- **React Router DOM 7.13.0** - Client-side routing and navigation
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js 4.5.1** - Interactive and responsive charts
- **React-ChartJS-2** - React wrapper for Chart.js

### Backend & Database
- **Firebase 12.9.0** - Backend-as-a-Service platform
  - **Firestore** - Real-time NoSQL database
  - **Authentication** - User authentication service
  - **Cloud Storage** - Secure data storage

### UI & Icons
- **Lucide React 0.574.0** - Beautiful icon library
- **React Icons 5.5.0** - Additional icon sets

### Utilities
- **date-fns 4.1.0** - Modern date utility library
- **jsPDF** - Client-side PDF generation
- **jsPDF-AutoTable** - Table plugin for jsPDF
- **XLSX** - Excel file generation and parsing
- **React Day Picker** - Advanced date picker component

### Development Tools
- **ESLint** - Code linting and quality checks
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohit-2059/FinTrack---Personal-Finance-Tracker.git
   cd FinTrack---Personal-Finance-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Copy your Firebase configuration
   - Create `src/firebase/config.js` and add your credentials

4. **Set up environment variables**
   ```javascript
   // src/firebase/config.js
   export const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
npm run preview
```

## 🌟 Key Highlights

- **Real-time Synchronization** - All changes sync instantly across devices
- **Secure Authentication** - Industry-standard Firebase authentication
- **Responsive Design** - Perfect experience on any device
- **Data Visualization** - Beautiful charts for better insights
- **Export Functionality** - Download reports in PDF or Excel format
- **Fast Performance** - Built with Vite for optimal speed
- **Modern React** - Uses latest React 19 features
- **Cloud Storage** - Never lose your financial data

## 📄 License

This project is open source and available for educational purposes.

## 👤 Author

**Rohit**
- GitHub: [@rohit-2059](https://github.com/rohit-2059)

## 🙏 Acknowledgments

- React team for the amazing framework
- Firebase for backend services
- Chart.js for data visualization
- Tailwind CSS for the styling framework
- All open-source contributors

---

⭐ **If you find this project useful, please consider giving it a star!** ⭐