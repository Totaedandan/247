// frontend/src/pages/ArticleDetailPage.js
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './ArticleDetailPage.css';

// YouTube/Vimeo → embed
const getEmbedUrl = (url) => {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      const id = u.searchParams.get('v') || u.pathname.replace('/', '');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    return url;
  } catch {
    return null;
  }
};

const fmtDate = (iso) => {
  if (!iso) return '';
  try { return new Date(iso).toLocaleDateString('ru-RU'); } catch { return iso; }
};

// оцениваем время чтения, если бэк не прислал
const calcReading = (html, fallback) => {
  if (fallback) return fallback;
  if (!html) return '';
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(' ').length : 0;
  const minutes = Math.max(1, Math.round(words / 200)); // 200 wpm
  return `${minutes} мин`;
};

function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Похожие (опционально — если эндпоинт есть)
  const [related, setRelated] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/api/articles/posts/${slug}/`);
        if (!cancelled) setArticle(data);

        // если есть категория — попробуем подтянуть похожие
        if (data?.category?.slug) {
          try {
            const { data: rel } = await axios.get('/api/articles/posts/', {
              params: { category: data.category.slug, page_size: 3, ordering: '-created_at' },
            });
            const list = Array.isArray(rel?.results) ? rel.results : Array.isArray(rel) ? rel : [];
            // исключить текущую
            const filtered = list.filter((a) => a.slug !== data.slug).slice(0, 3);
            if (!cancelled) setRelated(filtered);
          } catch {
            // мягко игнорим
          }
        } else {
          if (!cancelled) setRelated([]);
        }
      } catch (e) {
        console.error('Error fetching article details:', e);
        if (!cancelled) setArticle(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchArticle();
    return () => { cancelled = true; };
  }, [slug]);

  const embedUrl = useMemo(() => getEmbedUrl(article?.video_url), [article]);

  // Избегаем mix '||' и '&&': сначала собираем fallback в переменную
  const readingTime = useMemo(() => {
    const rt = article?.reading_time;
    const rtMin = article?.reading_time_minutes;
    const fallback = rt || (rtMin ? `${rtMin} мин` : '');
    return calcReading(article?.content, fallback);
  }, [article]);

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Ссылка скопирована 👍');
    } catch {
      alert('Не удалось скопировать ссылку');
    }
  };

  if (isLoading) {
    return (
      <div className="article-detail-container">
        <p className="muted">Загрузка статьи…</p>
      </div>
    );
  }
  if (!article) {
    return (
      <div className="article-detail-container">
        <p className="muted">Статья не найдена.</p>
      </div>
    );
  }

  return (
    <div className="article-detail-container">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link to="/">Главная</Link>
        <span className="sep">/</span>
        <Link to="/beneficial">Полезные материалы</Link>
        {article?.category?.slug ? (
          <>
            <span className="sep">/</span>
            <Link to={`/beneficial/category/${article.category.slug}`}>{article.category.name}</Link>
          </>
        ) : null}
      </nav>

      {/* Header */}
      <header className="article-detail-header">
        <h1>{article.title}</h1>

        <div className="article-meta">
          <span className="meta-item">
            <span className="avatar" aria-hidden="true" />
            {article.author || 'Автор'}
          </span>
          {article?.category?.name ? (
            <span className="meta-item">
              <span className="dot" />
              {article.category.name}
            </span>
          ) : null}
          {article?.created_at ? (
            <span className="meta-item">
              <span className="dot" />
              {fmtDate(article.created_at)}
            </span>
          ) : null}
          {readingTime ? (
            <span className="meta-item">
              <span className="dot" />
              {readingTime}
            </span>
          ) : null}
          {typeof article?.views === 'number' ? (
            <span className="meta-item">
              <span className="dot" />
              {article.views} просмотров
            </span>
          ) : null}
        </div>
      </header>

      {/* Media */}
      <div className="article-media-container">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={article.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <img src={article.main_image} alt={article.title} loading="lazy" />
        )}
      </div>

      {/* Content */}
      <article
        className="article-content"
        // ВАЖНО: предполагаем доверенный HTML из админки
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tags + Share */}
      <div className="article-footer">
        {Array.isArray(article?.tags) && article.tags.length > 0 ? (
          <div className="tag-list">
            {article.tags.map((t) => (
              <Link
                key={(t.slug) || t.name}
                to={`/beneficial/tag/${(t.slug || '')}`}
                className="tag-chip"
              >
                {t.name}
              </Link>
            ))}
          </div>
        ) : <span />}

        <div className="share">
          <button className="share-btn" onClick={onShare}>Поделиться</button>
        </div>
      </div>

      {/* Related (опционально) */}
      {related.length > 0 ? (
        <section className="related">
          <h3>Вам также может понравиться</h3>
          <div className="related-grid">
            {related.map((a) => (
              <Link key={a.slug} to={`/articles/${a.slug}`} className="related-card">
                <div className="related-thumb">
                  {a.main_image ? (
                    <img src={a.main_image} alt={a.title} loading="lazy" />
                  ) : (
                    <div className="thumb-ph" />
                  )}
                </div>
                <div className="related-body">
                  {a.category?.name ? <span className="related-cat">{a.category.name}</span> : null}
                  <h4 className="related-title">{a.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default ArticleDetailPage;
