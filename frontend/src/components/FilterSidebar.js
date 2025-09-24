import React from 'react';

// Пока это просто статичная верстка, логику добавим позже
function FilterSidebar() {
    return (
        <div className="filter-sidebar">
            <div className="filter-section">
                <h4>Платформы</h4>
                <label><input type="checkbox" /> MetaTrader 4</label>
                <label><input type="checkbox" /> MetaTrader 5</label>
                <label><input type="checkbox" /> cTrader</label>
            </div>
            <div className="filter-section">
                <h4>Размер счета</h4>
                <label><input type="checkbox" /> $5k-$25k</label>
                <label><input type="checkbox" /> $50k-$100k</label>
            </div>
            {/* Добавьте остальные секции фильтров по аналогии */}
            <button className="apply-filters-btn">Применить фильтры</button>
        </div>
    );
}

export default FilterSidebar;