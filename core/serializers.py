from rest_framework import serializers
from .models import Article, EconomicEvent, Trend, Tweet

class TweetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tweet
        fields = ['id', 'author', 'content', 'created_at'] # Поля, которые увидит фронтенд

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['id', 'title', 'published_at']

class TrendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trend
        fields = ['id', 'name', 'posts_count', 'change_percent']

class EconomicEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = EconomicEvent
        fields = ['id', 'name', 'event_date', 'event_time', 'volatility']