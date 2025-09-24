import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Импортируем компоненты
import PageTitle from '../components/PageTitle';
import UpcomingEventsWidget from '../components/UpcomingEventsWidget';
import RecommendedArticlesWidget from '../components/RecommendedArticlesWidget';
import TrendsWidget from '../components/TrendsWidget';

function MainPage() {
  const [articles, setArticles] = useState([]);
  const [trends, setTrends] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Используем правильные, полные пути к API
    axios.get('/api/core/articles/').then(res => setArticles(res.data));
    axios.get('/api/core/trends/').then(res => setTrends(res.data));
    axios.get('/api/core/events/').then(res => setEvents(res.data));
  }, []);

  return (
    <>
      <PageTitle />
      <div className="main-content-wrapper">
        <div className="app-layout">
          <main className="main-content">
            <div className="widget">
              <p>Здесь будет лента с постами...</p>
            </div>
          </main>
          <aside className="sidebar">
            <TrendsWidget trends={trends} />
            <RecommendedArticlesWidget articles={articles} />
            <UpcomingEventsWidget events={events} />
          </aside>
        </div>
      </div>
    </>
  );
}

export default MainPage;
