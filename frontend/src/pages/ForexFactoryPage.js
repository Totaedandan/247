import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ForexFactoryPage.css';

// Вспомогательная функция для форматирования даты
const formatDate = (date) => date.toISOString().split('T')[0];

// Иконки (без изменений)
const GraphIcon = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19V6.5C4 6.08593 4.14448 5.68881 4.40901 5.40901C4.67354 5.12921 5.04821 5 5.44 5H18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 15.5L8.5 11L12.5 15L18.5 9" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const EyeIcon = () => ( <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> );

// ОБНОВЛЕННЫЙ компонент для отображения деталей
const EventDetails = ({ event }) => (
    <div className="event-details-content">
        {event.source && (
            <div className="detail-item">
                <strong>Source:</strong>
                <p>
                    {/* Условие: если есть URL - делаем ссылку, если нет - просто текст */}
                    {event.source_url ? (
                        <a href={event.source_url} target="_blank" rel="noopener noreferrer">
                            {event.source}
                        </a>
                    ) : (
                        event.source
                    )}
                </p>
            </div>
        )}
        {event.measures && <div className="detail-item"><strong>Measures:</strong> <p>{event.measures}</p></div>}
        {/* ... остальные поля без изменений ... */}
        {event.usual_effect && <div className="detail-item"><strong>Usual Effect:</strong> <p>{event.usual_effect}</p></div>}
        {event.frequency && <div className="detail-item"><strong>Frequency:</strong> <p>{event.frequency}</p></div>}
        {event.next_release && <div className="detail-item"><strong>Next Release:</strong> <p>{event.next_release}</p></div>}
        {event.ff_notes && <div className="detail-item"><strong>FF Notes:</strong> <p>{event.ff_notes}</p></div>}
        {event.why_traders_care && <div className="detail-item"><strong>Why Traders Care:</strong> <p>{event.why_traders_care}</p></div>}
        {event.derived_via && <div className="detail-item"><strong>Derived Via:</strong> <p>{event.derived_via}</p></div>}
        {event.also_called && <div className="detail-item"><strong>Also Called:</strong> <p>{event.also_called}</p></div>}
        {event.acro_expand && <div className="detail-item"><strong>Acro Expand:</strong> <p>{event.acro_expand}</p></div>}
    </div>
);

function ForexFactoryPage() {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [openDetailId, setOpenDetailId] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const dateString = formatDate(selectedDate);
                const response = await axios.get(`/api/ff/forex-events/?date=${dateString}`);
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching forex events:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, [selectedDate]);

    const changeDay = (offset) => {
        setSelectedDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + offset);
            return newDate;
        });
    };

    const handleDetailToggle = (eventId) => {
        setOpenDetailId(prevId => (prevId === eventId ? null : eventId));
    };
    
    const renderImpactIcon = (impact) => {
        const impactColors = { 'High': '#db524b', 'Medium': '#e8a13a', 'Low': '#f9d14a' };
        return <span className="impact-icon" style={{ backgroundColor: impactColors[impact] || '#ccc' }}></span>;
    };

    return (
        <div className="ff-container">
            <div className="ff-header">
                <h1>Экономический календарь Forex Factory</h1>
                <p>События в реальном времени и новости, движущие рынок</p>
            </div>
            <div className="ff-controls">
                <div className="date-navigator">
                    <button onClick={() => changeDay(-1)}>&lt;</button>
                    <span>{selectedDate.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })}</span>
                    <button onClick={() => changeDay(1)}>&gt;</button>
                </div>
                <div className="filter-controls">
                    <button className="filter-btn">Фильтр</button>
                </div>
            </div>
            <div className="ff-table-container">
                <table className="ff-table">
                    <thead>
                        <tr>
                            <th>Время</th><th>Валюта</th><th>Влияние</th><th>Событие</th><th>Факт.</th><th>Прогноз</th><th>Пред.</th><th>График</th><th>Детали</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="9">Загрузка событий...</td></tr>
                        ) : events.length > 0 ? (
                            events.map(event => (
                                <React.Fragment key={event.id}>
                                    <tr className="event-main-row">
                                        <td>{event.event_time ? event.event_time.slice(0, 5) : 'Весь день'}</td>
                                        <td>{event.currency}</td>
                                        <td>{renderImpactIcon(event.impact)}</td>
                                        <td>{event.event_name}</td>
                                        <td>{event.actual}</td>
                                        <td>{event.forecast}</td>
                                        <td>{event.previous}</td>
                                        <td><button className="icon-btn"><GraphIcon /></button></td>
                                        <td>
                                            <button className="icon-btn" onClick={() => handleDetailToggle(event.id)}>
                                                <EyeIcon />
                                            </button>
                                        </td>
                                    </tr>
                                    {openDetailId === event.id && (
                                        <tr className="event-details-row">
                                            <td colSpan="9">
                                                <EventDetails event={event} />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr><td colSpan="9">Нет событий на выбранную дату.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ForexFactoryPage;
