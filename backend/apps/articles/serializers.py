from rest_framework import serializers
from .models import Article, Category, Tag

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name', 'slug']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['name', 'slug']

class ArticleListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка статей (краткая информация)."""
    category = serializers.StringRelatedField()
    
    class Meta:
        model = Article
        fields = ['title', 'slug', 'author', 'main_image', 'video_url', 'category', 'created_at', 'is_pinned']


class ArticleDetailSerializer(serializers.ModelSerializer):
    """Сериализатор для одной статьи (полная информация)."""
    category = CategorySerializer()
    tags = TagSerializer(many=True)

    class Meta:
        model = Article
        fields = '__all__' # Включаем все поля, включая 'content'