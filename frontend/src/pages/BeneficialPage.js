import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ArticleSidebar from '../components/ArticleSidebar';
import ArticleCard from '../components/ArticleCard';
import './BeneficialPage.css'; // Создадим этот файл для стилей

function BeneficialPage() {
    const [articles, setArticles] = useState([]);
    const [pinnedArticle, setPinnedArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('/api/articles/posts/');
                // Находим закрепленную статью и убираем ее из общего списка
                const pinned = response.data.find(article => article.is_pinned);
                const regularArticles = response.data.filter(article => !article.is_pinned);
                
                setPinnedArticle(pinned);
                setArticles(regularArticles);
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, []);

    return (
        <div className="beneficial-page-container">
            <div className="beneficial-page-header">
                <h1>Полезные материалы для трейдеров</h1>
                <p>Советы, стратегии, аналитика и образовательные ресурсы для успешной торговли</p>
            </div>
            <div className="beneficial-page-layout">
                <aside className="beneficial-page-sidebar">
                    <ArticleSidebar />
                </aside>
                <main className="beneficial-page-main">
                    {isLoading ? (
                        <p>Загрузка статей...</p>
                    ) : (
                        <>
                            {/* Отображаем закрепленную статью, если она есть */}
                            {pinnedArticle && (
                                <Link to={`/articles/${pinnedArticle.slug}`} className="pinned-article-link">
                                    <ArticleCard article={pinnedArticle} isPinned={true} />
                                </Link>
                            )}
                            {/* Отображаем остальные статьи в виде сетки */}
                            <div className="articles-grid">
                                {articles.map(article => (
                                    <Link key={article.id} to={`/articles/${article.slug}`} className="article-link">
                                        <ArticleCard article={article} />
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

export default BeneficialPage;