import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';
import { HomePage } from './pages/HomePage';
import { OrderPage } from './pages/OrderPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { Footer } from './components/layout/Footer';
import { useEffect } from 'react';
import { useOrderStore } from './store/useOrderStore';
import { ToastProvider } from './providers/ToastProvider';

function App() {
  const { fetchPayments, fetchDeliveries, fetchCoffees, fetchUserProfile, fetchOrderHistory, fetchPaymentHistory } = useOrderStore();

  useEffect(() => {
    fetchCoffees();
    fetchPayments();
    fetchDeliveries();
    fetchUserProfile();
    fetchOrderHistory();
    fetchPaymentHistory();
  }, [fetchCoffees, fetchPayments, fetchDeliveries, fetchUserProfile, fetchOrderHistory, fetchPaymentHistory]);

  return (
    <>
      <ToastProvider />
      <Router>
        <div className="min-h-screen bg-white">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/commander" element={<OrderPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;