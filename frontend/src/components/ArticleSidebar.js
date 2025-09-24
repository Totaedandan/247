import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

// --- Иконки для категорий (простые SVG компоненты) ---
const BookIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const ChartIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path></svg>;
const DollarIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
// Добавьте другие иконки по аналогии

function ArticleSidebar() {
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    // Для примера, можно будет добавить логику получения популярных статей
    const popularArticles = [
        { id: 1, title: 'Как управлять рисками при торговле на форекс', date: '15.07.2025', readTime: '12 мин' },
        { id: 2, title: 'Топ-5 ошибок начинающих трейдеров', date: '12.07.2025', readTime: '8 мин' },
    ];

    useEffect(() => {
        axios.get('/api/articles/categories/').then(res => setCategories(res.data));
        axios.get('/api/articles/tags/').then(res => setTags(res.data));
    }, []);

    // Функция для выбора иконки (в реальном проекте можно сделать более гибко)
    const getCategoryIcon = (slug) => {
        switch(slug) {
            case 'obuchenie': return <BookIcon />;
            case 'strategii': return <ChartIcon />;
            case 'tekhnicheskij-analiz': return <ChartIcon />;
            case 'fundamentalnyj-analiz': return <DollarIcon />;
            default: return <BookIcon />;
        }
    }

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
                    {popularArticles.map(article => (
                        <div key={article.id} className="popular-post-item">
                            <div className="popular-post-placeholder"></div>
                            <div className="popular-post-details">
                                <p>{article.title}</p>
                                <span>{article.date} · {article.readTime}</span>
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
