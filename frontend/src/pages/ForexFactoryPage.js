// frontend/src/pages/ForexFactoryPage.js
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './ForexFactoryPage.css';

// helper
const formatDate = (date) => date.toISOString().split('T')[0];

// icons
const GraphIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 19V6.5c0-.414.144-.811.409-1.091A1.45 1.45 0 0 1 5.44 5H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 15.5 8.5 11l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// details
const EventDetails = ({ event }) => (
  <div className="event-details-content">
    {event.source && (
      <div className="detail-item">
        <strong>Источник</strong>
        <p>
          {event.source_url ? (
            <a href={event.source_url} target="_blank" rel="noopener noreferrer">{event.source}</a>
          ) : event.source}
        </p>
      </div>
    )}
    {event.measures && <div className="detail-item"><strong>Показатель</strong><p>{event.measures}</p></div>}
    {event.usual_effect && <div className="detail-item"><strong>Обычно влияет</strong><p>{event.usual_effect}</p></div>}
    {event.frequency && <div className="detail-item"><strong>Частота</strong><p>{event.frequency}</p></div>}
    {event.next_release && <div className="detail-item"><strong>Следующий релиз</strong><p>{event.next_release}</p></div>}
    {event.ff_notes && <div className="detail-item"><strong>Примечания</strong><p>{event.ff_notes}</p></div>}
    {event.why_traders_care && <div className="detail-item"><strong>Почему важно</strong><p>{event.why_traders_care}</p></div>}
    {event.derived_via && <div className="detail-item"><strong>Методика</strong><p>{event.derived_via}</p></div>}
    {event.also_called && <div className="detail-item"><strong>Также называют</strong><p>{event.also_called}</p></div>}
    {event.acro_expand && <div className="detail-item"><strong>Аббревиатура</strong><p>{event.acro_expand}</p></div>}
  </div>
);

// ===== Справочники фильтров (value — то, что уходит в API; label — то, что видит пользователь)
const IMPACT_OPTIONS = [
  { value: 'High', label: 'Высокое' },
  { value: 'Medium', label: 'Среднее' },
  { value: 'Low', label: 'Низкое' },
];

const CURRENCY_OPTIONS = [
  'USD','EUR','GBP','JPY','AUD','NZD','CAD','CHF','CNY'
].map(v => ({ value: v, label: v }));

const EVENT_TYPE_OPTIONS = [
  { value: 'growth', label: 'Рост' },
  { value: 'inflation', label: 'Инфляция' },
  { value: 'jobs', label: 'Занятость' },
  { value: 'centralbank', label: 'Центральныйбанк' },
  { value: 'bonds', label: 'Облигации' },
  { value: 'housing', label: 'Жильё' },
  { value: 'consumer', label: 'Потребительскиеопросы' },
  { value: 'business', label: 'Бизнесопросы' },
  { value: 'speeches', label: 'Выступления' },
  { value: 'other', label: 'Разное' },
];

const TIMEZONES = [
  'UTC-5','UTC-4','UTC-3','UTC-2','UTC-1','UTC+0','UTC+1','UTC+2','UTC+3',
  'UTC+4','UTC+5','UTC+6','UTC+7','UTC+8','UTC+9'
];

function ForexFactoryPage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [openDetailId, setOpenDetailId] = useState(null);

  // ===== фильтры =====
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // дефолт: все влияния включены, все валюты выключены (равно «все» на бэке), типы — пусто
  const [filters, setFilters] = useState({
    impact: IMPACT_OPTIONS.map(o => o.value),
    currencies: [],
    eventTypes: [],
  });
  const [timezone, setTimezone] = useState('UTC+6');

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.impact.length !== IMPACT_OPTIONS.length) n += 1;
    if (filters.currencies.length > 0) n += 1;
    if (filters.eventTypes.length > 0) n += 1;
    return n;
  }, [filters]);

  // ===== загрузка событий =====
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const dateString = formatDate(selectedDate);
        const { data } = await axios.get('/api/ff/forex-events/', {
          params: {
            date: dateString,
            impact: filters.impact.join(','),            // "High,Medium"
            currencies: filters.currencies.join(','),    // "USD,EUR"
            event_types: filters.eventTypes.join(','),   // "inflation,jobs"
            timezone,                                    // "UTC+6"
          },
        });
        setEvents(data);
      } catch (e) {
        console.error('Error fetching forex events:', e);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
    // перезагружаем при изменении даты/фильтров/таймзоны
  }, [selectedDate, filters, timezone]);

  const changeDay = (offset) => {
    setSelectedDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + offset);
      return d;
    });
  };

  const handleDetailToggle = (id) => setOpenDetailId(prev => (prev === id ? null : id));

  const renderImpactIcon = (impact) => {
    const map = { High: 'high', Medium: 'medium', Low: 'low' };
    return <span className={`impact-dot ${map[impact] || 'none'}`} aria-label={impact} />;
  };

  // ===== обработчики фильтра =====
  const toggleInArray = (arr, value) =>
    arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];

  const onToggleImpact = (value) =>
    setFilters(f => ({ ...f, impact: toggleInArray(f.impact, value) }));

  const onToggleCurrency = (value) =>
    setFilters(f => ({ ...f, currencies: toggleInArray(f.currencies, value) }));

  const onToggleEventType = (value) =>
    setFilters(f => ({ ...f, eventTypes: toggleInArray(f.eventTypes, value) }));

  const resetFilters = () => {
    setFilters({
      impact: IMPACT_OPTIONS.map(o => o.value),
      currencies: [],
      eventTypes: [],
    });
  };

  const applyFiltersAndClose = () => setIsFilterOpen(false);

  return (
    <div className="ff-container">
      <div className="ff-header">
        <h1>Экономический календарь Forex Factory</h1>
        <p>События в реальном времени и новости, движущие рынок</p>
      </div>

      <div className="ff-controls">
        <div className="date-navigator">
          <button className="nav-round" onClick={() => changeDay(-1)} aria-label="Предыдущий день">‹</button>
          <span className="date-label">
            {selectedDate.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })}
          </span>
          <button className="nav-round" onClick={() => changeDay(1)} aria-label="Следующий день">›</button>
        </div>

        <div className="filter-controls" style={{display:'flex', gap:12, alignItems:'center'}}>
          <select
            className="timezone-select"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </select>

          <button className="filter-btn" onClick={() => setIsFilterOpen(true)}>
            Фильтр{activeFilterCount ? ` • ${activeFilterCount}` : ''}
          </button>
        </div>
      </div>

      {/* ===== Таблица ===== */}
      <div className="ff-table-container">
        <table className="ff-table">
          <thead>
            <tr>
              <th>Время (UTC+6)</th>
              <th>Валюта</th>
              <th>Влияние</th>
              <th>Событие</th>
              <th>Факт</th>
              <th>Прогноз</th>
              <th>Предыдущий</th>
              <th>График</th>
              <th>Детали</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="9" className="muted">Загрузка событий…</td></tr>
            ) : events.length ? (
              events.map(ev => (
                <React.Fragment key={ev.id}>
                  <tr className="event-main-row">
                    <td className="time">{ev.event_time ? ev.event_time.slice(0,5) : 'Весь день'}</td>
                    <td className="currency"><span className="pill">{ev.currency}</span></td>
                    <td className="impact">{renderImpactIcon(ev.impact)}</td>
                    <td className="name">{ev.event_name}</td>
                    <td className="num">{ev.actual}</td>
                    <td className="num">{ev.forecast}</td>
                    <td className="num">{ev.previous}</td>
                    <td className="actions"><button className="pill-btn" title="График"><GraphIcon/></button></td>
                    <td className="actions">
                      <button
                        className={`pill-btn ${openDetailId === ev.id ? 'active' : ''}`}
                        onClick={() => handleDetailToggle(ev.id)}
                        title="Детали"
                      >
                        <EyeIcon/>
                      </button>
                    </td>
                  </tr>
                  {openDetailId === ev.id && (
                    <tr className="event-details-row">
                      <td colSpan="9">
                        <EventDetails event={ev} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr><td colSpan="9" className="muted">Нет событий на выбранную дату.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== МОДАЛЬ ФИЛЬТРА ===== */}
      {isFilterOpen && (
        <div className="ff-filter-overlay" onClick={() => setIsFilterOpen(false)}>
          <div className="ff-filter-panel" onClick={(e) => e.stopPropagation()}>
            <div className="ff-filter-head">
              <strong>Фильтр</strong>
              <button className="link-btn" onClick={resetFilters}>Сбросить всё</button>
            </div>

            <div className="ff-filter-grid">
              {/* Влияние */}
              <div className="filter-block">
                <h4>Ожидаемое влияние</h4>
                <ul className="check-list">
                  {IMPACT_OPTIONS.map(opt => (
                    <li key={opt.value}>
                      <label>
                        <input
                          type="checkbox"
                          checked={filters.impact.includes(opt.value)}
                          onChange={() => onToggleImpact(opt.value)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Валюты */}
              <div className="filter-block">
                <h4>Валюты</h4>
                <ul className="check-list cols-2">
                  {CURRENCY_OPTIONS.map(opt => (
                    <li key={opt.value}>
                      <label>
                        <input
                          type="checkbox"
                          checked={filters.currencies.includes(opt.value)}
                          onChange={() => onToggleCurrency(opt.value)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Типы событий */}
              <div className="filter-block">
                <h4>Типы событий</h4>
                <ul className="check-list cols-2">
                  {EVENT_TYPE_OPTIONS.map(opt => (
                    <li key={opt.value}>
                      <label>
                        <input
                          type="checkbox"
                          checked={filters.eventTypes.includes(opt.value)}
                          onChange={() => onToggleEventType(opt.value)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="ff-filter-footer">
              <button className="btn ghost" onClick={() => setIsFilterOpen(false)}>Отмена</button>
              <button className="btn primary" onClick={applyFiltersAndClose}>Применить фильтр</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ForexFactoryPage;
