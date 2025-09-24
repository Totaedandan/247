from rest_framework import viewsets
from .models import ForexEvent
from .serializers import ForexEventSerializer
from django.utils.dateparse import parse_date

class ForexEventViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows forex events to be viewed.
    Supports filtering by date, impact, and currency.
    Example: /api/forex-events/?date=2025-07-09&impact=High,Medium&currency=USD,EUR
    """
    serializer_class = ForexEventSerializer

    def get_queryset(self):
        queryset = ForexEvent.objects.all()
        
        # Фильтрация по дате
        date_str = self.request.query_params.get('date')
        if date_str:
            date = parse_date(date_str)
            if date:
                queryset = queryset.filter(event_date=date)

        # Фильтрация по влиянию (может быть несколько, через запятую)
        impacts = self.request.query_params.get('impact')
        if impacts:
            impact_list = impacts.split(',')
            queryset = queryset.filter(impact__in=impact_list)
            
        # Фильтрация по валюте (может быть несколько, через запятую)
        currencies = self.request.query_params.get('currency')
        if currencies:
            currency_list = currencies.split(',')
            queryset = queryset.filter(currency__in=currency_list)

        return queryset.order_by('event_time')
