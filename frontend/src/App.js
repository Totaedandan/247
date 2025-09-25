// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Импортируем общие компоненты и страницы
import Header from './components/Header';
import MainPage from './pages/MainPage';
import ForexFactoryPage from './pages/ForexFactoryPage';
import PropFirmsPage from './pages/PropFirmsPage';
import BeneficialPage from './pages/BeneficialPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header /> {/* Хедер будет на всех страницах */}
        
        <Routes> {/* Контейнер для всех маршрутов-страниц */}
          <Route path="/" element={<MainPage />} />
          <Route path="/forex-factory" element={<ForexFactoryPage />} />
          <Route path="/prop-firms" element={<PropFirmsPage />} />
          <Route path="/beneficial" element={<BeneficialPage />} />
          <Route path="/articles/:slug" element={<ArticleDetailPage />} />
        </Routes>
        
        <Footer /> {/* Футер будет на всех страницах */}
      </div>
    </Router>
  );
}

export default App;