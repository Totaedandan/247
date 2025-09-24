// frontend/src/components/RecommendedArticlesWidget.js

import React from 'react';

function RecommendedArticlesWidget({ articles }) {
  return (
    <div className="widget">
      <h3 className="widget-title">Рекомендуем прочитать статью</h3>
      <div className="articles-list">
        {articles.slice(0, 3).map(article => (
          <div key={article.id} className="article-item">
            <div className="article-placeholder"></div>
            <div className="article-details">
              <p>{article.title}</p>
              <span>{new Date(article.published_at).toLocaleDateString()} · 12 мин</span>
            </div>
          </div>
        ))}
      </div>
       <a href="#" className="widget-more">Показать больше</a>
    </div>
  );
}

export default RecommendedArticlesWidget;