from rest_framework import viewsets, filters
from rest_framework.response import Response
from django.db.models import F
from .models import Article, Category, Tag
from .serializers import ArticleListSerializer, ArticleDetailSerializer, CategorySerializer, TagSerializer


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.all()
    lookup_field = 'slug'
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'views', 'is_pinned']
    ordering = ['-is_pinned', '-created_at']  # дефолт: закреплённые наверху, потом по дате

    def get_serializer_class(self):
        if self.action == 'list':
            return ArticleListSerializer
        return ArticleDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Фильтрация по категории
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        # Фильтрация по тегу
        tag_slug = self.request.query_params.get('tag')
        if tag_slug:
            queryset = queryset.filter(tags__slug=tag_slug)

        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Article.objects.filter(pk=instance.pk).update(views=F('views') + 1)
        instance.refresh_from_db(fields=['views'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
