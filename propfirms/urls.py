from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropFirmViewSet

router = DefaultRouter()
router.register(r'firms', PropFirmViewSet, basename='propfirm')

urlpatterns = [
    path('', include(router.urls)),
]