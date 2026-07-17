import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen overflow-hidden flex flex-col" style={{ backgroundColor: '#fff9f0', color: '#3a2a1a' }}>
        <Header />
        
        <main className="flex-1 flex flex-col p-4 md:p-6 w-full max-w-7xl mx-auto relative min-h-0">
          <Routes>
            <Route path="/" element={<Navigate to="/checkout" replace />} />
            <Route path="/checkout" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
