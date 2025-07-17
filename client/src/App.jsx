import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostAd from './pages/PostAd';
import Ads from './pages/Ads';
import AdDetails from './pages/AdDetails';
import Navigation from './components/Navigation';
import AppNavigation from './components/AppNavigation';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

const Layout = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  
  return (
    <div className="flex flex-col min-h-screen">
      {isLandingPage ? <Navigation /> : <AppNavigation />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'dashboard', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: 'post-ad', element: <ProtectedRoute><PostAd /></ProtectedRoute> },
      { path: 'ads', element: <Ads /> },
      { path: 'ads/:id', element: <AdDetails /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;