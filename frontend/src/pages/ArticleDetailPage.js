import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ArticleDetailPage.css'; // Создадим этот файл для стилей

// Вспомогательная функция для преобразования URL YouTube в URL для встраивания
const getEmbedUrl = (url) => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            const videoId = urlObj.searchParams.get('v');
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }
        // Можно добавить логику для Vimeo и других платформ
        return url;
    } catch (error) {
        console.error("Invalid video URL", error);
        return null;
    }
};

function ArticleDetailPage() {
    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { slug } = useParams(); // Получаем slug из URL

    useEffect(() => {
        const fetchArticle = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/articles/posts/${slug}/`);
                setArticle(response.data);
            } catch (error) {
                console.error("Error fetching article details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
    }, [slug]); // Перезапрашиваем данные, если slug меняется

    if (isLoading) {
        return <div className="article-detail-container"><p>Загрузка статьи...</p></div>;
    }

    if (!article) {
        return <div className="article-detail-container"><p>Статья не найдена.</p></div>;
    }

    const embedUrl = getEmbedUrl(article.video_url);

    return (
        <div className="article-detail-container">
            <div className="article-detail-header">
                <h1>{article.title}</h1>
                <div className="article-meta">
                    <span>Автор: {article.author}</span>
                    <span>Категория: {article.category.name}</span>
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="article-media-container">
                {embedUrl ? (
                    <iframe
                        src={embedUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={article.title}
                    ></iframe>
                ) : (
                    <img src={article.main_image} alt={article.title} />
                )}
            </div>

            {/* Этот блок безопасно отображает HTML-контент из админки.
                Используйте dangerouslySetInnerHTML только для доверенного контента!
            */}
            <div 
                className="article-content" 
                dangerouslySetInnerHTML={{ __html: article.content }} 
            />
        </div>
    );
}

export default ArticleDetailPage;
