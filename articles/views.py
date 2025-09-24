from rest_framework import viewsets
from .models import Article, Category, Tag
from .serializers import ArticleListSerializer, ArticleDetailSerializer, CategorySerializer, TagSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'

class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'slug'

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.all().order_by('-created_at')
    lookup_field = 'slug' # Позволяет искать статьи по текстовому slug, а не по ID

    def get_serializer_class(self):
        # Если это запрос на список статей - отдаем краткий сериализатор
        if self.action == 'list':
            return ArticleListSerializer
        # Если это запрос на одну статью - отдаем полный сериализатор
        return ArticleDetailSerializer
    
    def get_queryset(self):
        queryset = Article.objects.all().order_by('-is_pinned', '-created_at') # Закрепленные всегда вверху
        
        # Фильтрация по категории
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
            
        # Фильтрация по тегу
        tag_slug = self.request.query_params.get('tag')
        if tag_slug:
            queryset = queryset.filter(tags__slug=tag_slug)
            
        return queryset