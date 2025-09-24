import React from 'react';

function ArticleCard({ article, isPinned = false }) {
    
    // Если статья закреплена, используем другую разметку
    if (isPinned) {
        return (
            <div className="article-card pinned">
                <div className="article-card-image-container">
                    <img src={article.main_image} alt={article.title} />
                </div>
                <div className="article-card-content">
                    <span className="article-card-category">{article.category}</span>
                    <h3>{article.title}</h3>
                    <div className="article-card-footer">
                        <span>{article.author}</span>
                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        );
    }

    // Стандартная карточка для сетки
    return (
        <div className="article-card">
            <div className="article-card-image-container">
                <img src={article.main_image} alt={article.title} />
                {article.video_url && <div className="play-icon">▶</div>}
            </div>
            <div className="article-card-content">
                <span className="article-card-category">{article.category}</span>
                <h3>{article.title}</h3>
                <div className="article-card-footer">
                    <span>{article.author}</span>
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
}

export default ArticleCard;
