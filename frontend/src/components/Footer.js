import React from "react";
import { NavLink } from "react-router-dom";

const SocialIcon = ({ type, label, href }) => {
  const icons = {
    x: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    facebook: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M15 3h-3a4 4 0 00-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 011-1h3V3z" fill="currentColor"/>
      </svg>
    ),
    instagram: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
      </svg>
    ),
    youtube: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M23 12s0-4-1-5-3-1-3-1H5s-2 0-3 1-1 5-1 5 0 4 1 5 3 1 3 1h14s2 0 3-1 1-5 1-5z" stroke="currentColor" strokeWidth="1.8" fill="none"/>
        <path d="M10 15l5-3-5-3v6z" fill="currentColor"/>
      </svg>
    ),
  };
  return (
    <a className="foot-social" href={href} aria-label={label} target="_blank" rel="noreferrer">
      {icons[type]}
    </a>
  );
};

function Footer() {
  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: подключить реальную подписку
  };

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* grid 4 колонки */}
        <div className="f-col brand">
          <div className="foot-logo">247.com</div>
          <p className="foot-desc">
            Лучший ресурс для трейдеров с актуальной информацией о проп фирмах,
            экономических событиях и полезных инструментах.
          </p>
        </div>

        <div className="f-col">
          <h4>Разделы</h4>
          <ul className="foot-links">
            <li><NavLink to="/">Главная</NavLink></li>
            <li><NavLink to="/forex-factory">Forex Factory</NavLink></li>
            <li><NavLink to="/prop-firms">Проп фирмы</NavLink></li>
            <li><NavLink to="/indicators">Индикаторы</NavLink></li>
            <li><NavLink to="/beneficial">Полезное</NavLink></li>
          </ul>
        </div>

        <div className="f-col">
          <h4>Информация</h4>
          <ul className="foot-links">
            <li><NavLink to="/about">О нас</NavLink></li>
            <li><NavLink to="/contacts">Контакты</NavLink></li>
            <li><NavLink to="/privacy">Политика конфиденциальности</NavLink></li>
            <li><NavLink to="/terms">Условия использования</NavLink></li>
          </ul>
        </div>

        <div className="f-col subscribe">
          <h4>Подписаться</h4>
          <p className="foot-desc">
            Получайте последние новости и обновления на почту
          </p>
          <form className="subscribe-form" onSubmit={onSubmit}>
            <input type="email" placeholder="Ваш email" aria-label="Email" required />
            <button type="submit">OK</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div className="copyright">© 2025 247.com. Все права защищены.</div>
          <div className="socials">
            <SocialIcon type="x" label="X / Twitter" href="#" />
            <SocialIcon type="facebook" label="Facebook" href="#" />
            <SocialIcon type="instagram" label="Instagram" href="#" />
            <SocialIcon type="youtube" label="YouTube" href="#" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
