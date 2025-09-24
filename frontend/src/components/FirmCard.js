import React from 'react';

// Иконки для плюсов и минусов
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const MinusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>;


function FirmCard({ firm }) {
    return (
        <div className="firm-card">
            <div className="firm-card-header">
                <div className="firm-info">
                    {firm.logo && <img src={firm.logo} alt={`${firm.name} logo`} className="firm-logo" />}
                    <div className="firm-name-section">
                        <h2>{firm.name}</h2>
                        <div className="firm-rating">⭐ {firm.rating}</div>
                        <div className="firm-tags">
                            {firm.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                        </div>
                    </div>
                </div>
                <div className="firm-price-section">
                    <span className="price-from">От</span>
                    <span className="price-amount">${parseInt(firm.price)}</span>
                    <a href={firm.details_url || '#'} className="details-btn">Выбрать</a>
                    <a href={firm.details_url || '#'} className="details-link">Подробнее &gt;</a>
                </div>
            </div>
            <div className="firm-card-body">
                <div className="pros-cons-section">
                    <h4><PlusIcon /> Плюсы</h4>
                    <ul>
                        {firm.pros_list.map((pro, index) => <li key={index}>{pro}</li>)}
                    </ul>
                </div>
                <div className="pros-cons-section">
                    <h4><MinusIcon /> Минусы</h4>
                    <ul>
                        {firm.cons_list.map((con, index) => <li key={index}>{con}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default FirmCard;