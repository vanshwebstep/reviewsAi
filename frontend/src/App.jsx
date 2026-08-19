// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home.jsx'
import Subscribe from './pages/Subscribe.jsx'
import SubscribeSuccess from './pages/SubscribeSuccess.jsx'
import Success from './pages/Success.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { ModalProvider } from './context/ModalContext'
import Profile from './pages/Profile';
import Plans from './pages/Plans';
import ChatbotWidget from './components/ChatbotWidget';

import Contact from './pages/Contact';
import UpgradeSuccess from './pages/UpgradeSuccess';
import SmartReply from './pages/SmartReply'
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPlans from './pages/admin/AdminPlans';
import AdminPromo from './pages/admin/AdminPromo';
import AdminDashboard from './pages/admin/AdminDashboard';
const loaderStyle = {
  minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: "'Poppins', sans-serif", color: '#64748b', fontSize: 14,
};

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={loaderStyle}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminProtectedRoute({ children }) {
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) return <Navigate to="/admin/login" replace />;
  return children;
}
function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div style={loaderStyle}>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
      <Route path="/subscribe" element={<Subscribe />} />
      <Route path="/subscribe/success" element={<SubscribeSuccess />} />
      <Route path="/success" element={<Success />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/plans" element={<Plans />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/upgrade/success" element={<ProtectedRoute><UpgradeSuccess /></ProtectedRoute>} />
      <Route path="/smart-reply" element={<ProtectedRoute><SmartReply /></ProtectedRoute>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="plans" element={<AdminPlans />} />
        <Route path="promo" element={<AdminPromo />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/demo/reviewsai/frontend">
      <AuthProvider>
        <ModalProvider>
          <AppRoutes />
           <ChatbotWidget />
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}