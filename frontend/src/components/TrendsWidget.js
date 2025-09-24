// frontend/src/components/TrendsWidget.js

import React from 'react';

const getChangeStyle = (change) => {
    if (change.startsWith('+')) return { color: '#4caf50' }; // Зеленый
    if (change.startsWith('-')) return { color: '#f44336' }; // Красный
    return {};
};

function TrendsWidget({ trends }) {
    return (
        <div className="widget">
            <h3 className="widget-title">Тренды сейчас</h3>
            <ol className="trends-list"> {/* Используем нумерованный список */}
                {trends.map((trend, index) => (
                    <li key={trend.id} className="trend-item">
                        <div className="trend-info">
                            <p>{trend.name}</p>
                            <span>{trend.posts_count} постов</span>
                        </div>
                        <div className="trend-change" style={getChangeStyle(trend.change_percent)}>
                            {trend.change_percent}
                        </div>
                    </li>
                ))}
            </ol>
            <a href="#" className="widget-more">Показать больше</a>
        </div>
    );
}

export default TrendsWidget;