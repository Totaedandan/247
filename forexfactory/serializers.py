from rest_framework import serializers
from .models import ForexEvent

class ForexEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForexEvent
        # Включаем все поля из модели
        fields = '__all__'