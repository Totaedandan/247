from rest_framework import viewsets
from .models import Article, Trend # EconomicEvent больше не используется для этого виджета
from .serializers import ArticleSerializer, TrendSerializer
from django.utils import timezone

# Импортируем модель и сериализатор из нашего приложения forexfactory
from forexfactory.models import ForexEvent
from forexfactory.serializers import ForexEventSerializer as ForexFactoryEventSerializer

# ArticleViewSet и TrendViewSet остаются без изменений
class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.all().order_by('-published_at')
    serializer_class = ArticleSerializer

class TrendViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Trend.objects.all()
    serializer_class = TrendSerializer

# ЭТОТ VIEWSET ТЕПЕРЬ БЕРЕТ ДАННЫЕ ИЗ FOREX FACTORY
class EconomicEventViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ForexFactoryEventSerializer # Используем новый сериализатор

    def get_queryset(self):
        today = timezone.now().date()
        return ForexEvent.objects.filter(event_date__gte=today).order_by('event_date', 'event_time')[:5]
