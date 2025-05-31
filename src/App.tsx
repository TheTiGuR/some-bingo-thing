import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BoardProvider } from './contexts/BoardContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import BoardCreatorPage from './pages/BoardCreatorPage';
import BoardEditorPage from './pages/BoardEditorPage';
import BoardSharePage from './pages/BoardSharePage';
import BoardViewPage from './pages/BoardViewPage';

// Add animations to CSS
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BoardProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/board/new" element={<BoardCreatorPage />} />
                <Route path="/board/:id" element={<BoardEditorPage />} />
                <Route path="/board/share/:id" element={<BoardSharePage />} />
                <Route path="/board/view/:id" element={<BoardViewPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Router>
      </BoardProvider>
    </AuthProvider>
  );
}

export default App;