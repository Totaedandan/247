import React from 'react';

// Вспомогательная функция для получения месяца на русском
const getMonthName = (date) => {
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    return months[new Date(date).getMonth()];
};

// Цвета для разных уровней влияния
const impactColors = {
    'High': '#db524b',   // Красный
    'Medium': '#e8a13a', // Оранжевый
    'Low': '#f9d14a',    // Желтый
};

function UpcomingEventsWidget({ events }) {
  return (
    <div className="widget">
      <h3 className="widget-title">Ближайшие события</h3>
      <div className="events-list">
        {events && events.length > 0 ? (
          events.map(event => (
            <div key={event.id} className="event-item">
              {/* Динамически устанавливаем цвет фона в зависимости от влияния */}
              <div
                className="event-date"
                style={{ backgroundColor: impactColors[event.impact] || '#cccccc' }} // По умолчанию серый, если влияние не указано
              >
                  <div className="event-day">{new Date(event.event_date).getDate()}</div>
                  <div className="event-month">{getMonthName(event.event_date)}</div>
              </div>
              <div className="event-details">
                <p>{event.event_name}</p>
                <span>
                  {event.event_time ? `${event.event_time.slice(0, 5)} МСК` : ''}
                  {/* Заменяем старую логику на отображение прогноза */}
                  {event.forecast ? ` · Прогноз: ${event.forecast}` : ''}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>Нет предстоящих событий.</p>
        )}
      </div>
      <a href="/forex-factory" className="widget-more">Весь календарь</a>
    </div>
  );
}

export default UpcomingEventsWidget;
