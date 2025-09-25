from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ForexEventViewSet

router = DefaultRouter()
router.register(r'forex-events', ForexEventViewSet, basename='forexevent')

urlpatterns = [
    path('', include(router.urls)),
]