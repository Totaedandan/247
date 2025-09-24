import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterSidebar from '../components/FilterSidebar';
import FirmCard from '../components/FirmCard';
import './PropFirmsPage.css'; // Создадим этот файл для стилей

function PropFirmsPage() {
    const [firms, setFirms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFirms = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('/api/prop/firms/');
                setFirms(response.data);
            } catch (error) {
                console.error("Error fetching prop firms:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFirms();
    }, []);

    return (
        <div className="prop-page-container">
            <div className="prop-page-header">
                <h1>Подбор проп фирмы</h1>
                <p>Найдите идеальную проп фирму под ваш стиль торговли</p>
            </div>
            <div className="prop-page-layout">
                <aside className="prop-page-sidebar">
                    <FilterSidebar />
                </aside>
                <main className="prop-page-main">
                    {isLoading ? (
                        <p>Загрузка фирм...</p>
                    ) : firms.length > 0 ? (
                        firms.map(firm => <FirmCard key={firm.id} firm={firm} />)
                    ) : (
                        <p>Фирмы не найдены.</p>
                    )}
                </main>
            </div>
        </div>
    );
}

export default PropFirmsPage;