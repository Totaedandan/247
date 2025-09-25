import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="header-outer">
      <div className="header-inner">
        <div className="header-logo">
          <NavLink to="/">247.asia</NavLink>
        </div>

        <nav className="header-nav">
          <NavLink to="/" end>Главная</NavLink>
          <NavLink to="/forex-factory">Forex Factory</NavLink>
          <NavLink to="/prop-firms">Проп фирмы</NavLink>
          <NavLink to="/beneficial">Полезное</NavLink>
        </nav>

        <div className="header-actions">
          <NavLink to="/login" className="btn btn-outline">Войти</NavLink>
          <NavLink to="/signup" className="btn btn-primary">Зарегистрироваться</NavLink>
        </div>
      </div>
    </header>
  );
}

export default Header;
