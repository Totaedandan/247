from django.urls import path, include
from rest_framework.routers import DefaultRouter
# Убираем TweetViewSet из импорта, так как он больше не используется
from .views import ArticleViewSet, TrendViewSet, EconomicEventViewSet

router = DefaultRouter()

# Убираем регистрацию для твитов
router.register(r'articles', ArticleViewSet)
router.register(r'trends', TrendViewSet)
# Добавляем basename, чтобы помочь роутеру
router.register(r'events', EconomicEventViewSet, basename='economicevent')

urlpatterns = [
    path('', include(router.urls)),
]
