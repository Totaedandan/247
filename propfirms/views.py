from rest_framework import viewsets
from .models import PropFirm
from .serializers import PropFirmSerializer

class PropFirmViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint, который отдает список проп-фирм с возможностью фильтрации.
    """
    serializer_class = PropFirmSerializer
    
    def get_queryset(self):
        queryset = PropFirm.objects.all()
        
        # Пример фильтрации по платформам (остальные добавим по аналогии)
        platforms = self.request.query_params.get('platforms')
        if platforms:
            platform_list = platforms.split(',')
            queryset = queryset.filter(platforms__name__in=platform_list).distinct()
            
        return queryset