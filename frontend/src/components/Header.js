// frontend/src/components/Header.js

import React from 'react';
import { NavLink } from 'react-router-dom'; // <-- Импортируем NavLink

function Header() {
  return (
    <header className="header-outer">
      <div className="header-inner">
        <div className="header-logo">
          {/* Используем NavLink для логотипа, чтобы он тоже был частью роутинга */}
          <NavLink to="/">247.com</NavLink>
        </div>
        <nav className="header-nav">
          {/* Заменяем все <a> на <NavLink> */}
          <NavLink to="/">Главная</NavLink>
          <NavLink to="/forex-factory">Forex Factory</NavLink>
          <NavLink to="/prop-firms">Проп фирмы</NavLink>
          <NavLink to="/indicators">Индикаторы</NavLink>
          <NavLink to="/beneficial">Полезное</NavLink>
        </nav>
        <div className="header-actions">
          <button>Зарегистрироваться</button>
        </div>
      </div>
    </header>
  );
}

export default Header;