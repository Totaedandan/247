// frontend/src/pages/BeneficialPage.js
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

import ArticleSidebar from '../components/ArticleSidebar';
import ArticleCard from '../components/ArticleCard';
import './BeneficialPage.css';

const PAGE_SIZE = 9; // 3x3, как в макете

function BeneficialPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [pinnedArticle, setPinnedArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [videoArticle, setVideoArticle] = useState(null);

  const [totalCount, setTotalCount] = useState(0);

  const page = Number(searchParams.get('page') || 1);
  const sort = searchParams.get('sort') || 'new'; // 'new' | 'popular'

  // Маппинг селекта на поле сортировки бэка
  const ordering = useMemo(() => {
    return sort === 'popular' ? '-views' : '-created_at';
  }, [sort]);

  useEffect(() => {
    let cancelled = false;

    const fetchPage = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('/api/articles/posts/', {
          params: { page, page_size: PAGE_SIZE, ordering },
        });

        // Поддержка обоих вариантов ответа: с пагинацией DRF и без
        const list = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
        const count = typeof data?.count === 'number' ? data.count : list.length;

        // Находим закреплённую и видео-статью
        const pin = list.find(a => a.is_pinned) || null;
        const regular = list.filter(a => !a.is_pinned);

        const vid =
          list.find(a => a.is_video || a.type === 'video' || a.content_type === 'video') || null;

        if (!cancelled) {
          setPinnedArticle(pin);
          setArticles(regular);
          setVideoArticle(vid);
          setTotalCount(count);
        }
      } catch (e) {
        if (!cancelled) {
          setPinnedArticle(null);
          setArticles([]);
          setVideoArticle(null);
          setTotalCount(0);
        }
        console.error('Error fetching articles:', e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchPage();
    return () => {
      cancelled = true;
    };
  }, [page, ordering]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const onChangeSort = (e) => {
    const value = e.target.value;
    // При смене сортировки возвращаемся на 1-ю страницу
    setSearchParams({ page: '1', sort: value });
  };

  const goToPage = (p) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setSearchParams({ page: String(next), sort });
  };

  // Простая заглушка подписки
  const onSubscribe = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    if (email) {
      alert('Спасибо! Мы добавили ' + email + ' в список рассылки.');
      e.currentTarget.reset();
    }
  };

  return (
    <div className="beneficial-page-container">
      {/* Заголовок страницы */}
      <div className="beneficial-page-header">
        <h1>Полезные материалы для трейдеров</h1>
        <p>Советы, стратегии, аналитика и образовательные ресурсы для успешной торговли</p>
      </div>

      <div className="beneficial-page-layout">
        {/* Левый сайдбар */}
        <aside className="beneficial-page-sidebar">
          <ArticleSidebar />
        </aside>

        {/* Основной контент */}
        <main className="beneficial-page-main">
          {isLoading ? (
            <p>Загрузка…</p>
          ) : (
            <>
              {/* Закреплённая (hero) */}
              {pinnedArticle && (
                <Link to={`/articles/${pinnedArticle.slug}`} className="pinned-article-link">
                  <ArticleCard article={pinnedArticle} isPinned />
                </Link>
              )}

              {/* Строка: найдено N + сортировка */}
              <div
                className="list-head"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: pinnedArticle ? 12 : 0,
                }}
              >
                <span className="muted">
                  {totalCount ? `Найдено ${totalCount} материалов` : 'Материалы не найдены'}
                </span>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="muted">Сортировка:</span>
                  <select value={sort} onChange={onChangeSort}>
                    <option value="new">По новизне</option>
                    <option value="popular">По популярности</option>
                  </select>
                </label>
              </div>

              {/* Сетка карточек */}
              <div className="articles-grid">
                {articles.map((article) => (
                  <Link
                    key={article.id ?? article.slug}
                    to={`/articles/${article.slug}`}
                    className="article-link"
                  >
                    <ArticleCard article={article} />
                  </Link>
                ))}
              </div>

              {/* Видео-карточка (если в выдаче есть видео) */}
              {videoArticle && (
                <article className="card-video">
                  <button className="play" aria-label="play" />
                  <div>
                    <div className="tag">Видеоурок</div>
                    <h3 style={{ margin: '6px 0 6px' }}>
                      {videoArticle.title || 'Видеоурок'}
                    </h3>
                    <p className="muted" style={{ margin: 0 }}>
                      {videoArticle.description?.slice(0, 120) ||
                        'Практическое руководство…'}
                    </p>
                  </div>
                </article>
              )}

              {/* CTA подписки */}
              <section className="cta">
                <div>
                  <h3 style={{ margin: '0 0 6px' }}>Подпишитесь на еженедельную рассылку</h3>
                  <p className="muted" style={{ margin: 0 }}>
                    Получайте свежие статьи и обзоры прямо на почту
                  </p>
                </div>
                <form className="subscribe" onSubmit={onSubscribe}>
                  <input type="email" name="email" placeholder="Ваш email" required />
                  <button type="submit">Подписаться</button>
                </form>
              </section>

              {/* Пагинация */}
              {totalPages > 1 && (
                <nav className="pagination">
                  <button onClick={() => goToPage(page - 1)} disabled={page <= 1}>
                    ‹
                  </button>
                  {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={p === page ? 'active' : undefined}
                      >
                        {p}
                      </button>
                    );
                  })}
                  {totalPages > 7 && <button disabled>…</button>}
                  {totalPages > 7 && (
                    <button onClick={() => goToPage(totalPages)}>{totalPages}</button>
                  )}
                  <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages}>
                    ›
                  </button>
                </nav>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default BeneficialPage;
