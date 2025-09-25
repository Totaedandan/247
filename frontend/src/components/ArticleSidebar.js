import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, Link } from 'react-router-dom';

// --- Иконки для категорий ---
const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);
const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"></path>
    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
  </svg>
);
const DollarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1v22"></path>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

// ---- Хелперы форматирования ----
const fmtDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('ru-RU');
  } catch {
    return iso;
  }
};
const fmtMinutes = (a) => {
  const v =
    a?.reading_time_minutes ??
    a?.reading_time ??
    a?.read_time ??
    null;
  if (v == null) return '';
  const n = Number(String(v).toString().replace(/[^\d]/g, ''));
  return Number.isFinite(n) && n > 0 ? `${n} мин` : '';
};

function ArticleSidebar() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(true);

  useEffect(() => {
    axios.get('/api/articles/categories/').then(res => setCategories(res.data)).catch(() => {});
    axios.get('/api/articles/tags/').then(res => setTags(res.data)).catch(() => {});
  }, []);

  // Подтягиваем «популярные» как на главной
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingPopular(true);
      try {
        const { data } = await axios.get('/api/core/articles/');
        if (!cancelled) {
          // если на бэке нет сортировки по популярности — возьмём первые 2–3
          setPopular((Array.isArray(data) ? data : []).slice(0, 2));
        }
      } catch {
        if (!cancelled) setPopular([]);
      } finally {
        if (!cancelled) setLoadingPopular(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'obuchenie':
        return <BookIcon />;
      case 'strategii':
      case 'tekhnicheskij-analiz':
        return <ChartIcon />;
      case 'fundamentalnyj-analiz':
        return <DollarIcon />;
      default:
        return <BookIcon />;
    }
  };

  return (
    <div className="article-sidebar">
      <div className="sidebar-section">
        <h4>Категории</h4>
        <nav>
          <ul>
            {categories.map(cat => (
              <li key={cat.slug}>
                <NavLink to={`/beneficial/category/${cat.slug}`}>
                  {getCategoryIcon(cat.slug)}
                  <span>{cat.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="sidebar-section">
        <h4>Популярные теги</h4>
        <div className="tags-container">
          {tags.map(tag => (
            <NavLink to={`/beneficial/tag/${tag.slug}`} key={tag.slug} className="tag-link">
              {tag.name}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h4>Популярные статьи</h4>
        <div className="popular-posts-list">
          {loadingPopular && <div className="popular-blank muted">Загрузка…</div>}
          {!loadingPopular && popular.length === 0 && (
            <div className="popular-blank muted">Пока нет данных</div>
          )}
          {!loadingPopular && popular.map(a => (
            <div key={a.id ?? a.slug} className="popular-post-item">
              <div className="popular-post-placeholder" />
              <div className="popular-post-details">
                <Link to={`/articles/${a.slug}`} className="popular-link">
                  <p className="popular-title">{a.title}</p>
                  <span className="popular-meta">
                    {fmtDate(a.published_at ?? a.date ?? a.created_at)}
                    {fmtMinutes(a) ? ` · ${fmtMinutes(a)}` : ''}
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h4>Сообщество</h4>
        <p className="community-text">Присоединяйтесь к нашему сообществу трейдеров</p>
        <div className="community-icons">
          <span>💬</span>
          <span>👥</span>
          <span>📹</span>
        </div>
      </div>
    </div>
  );
}

export default ArticleSidebar;
