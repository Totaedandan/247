from django.db import models
from django.utils import timezone
from ckeditor.fields import RichTextField

# --- Вспомогательные модели для фильтров ---

class Category(models.Model):
    name = models.CharField("Название категории", max_length=100, unique=True)
    slug = models.SlugField("URL-адрес (slug)", max_length=110, unique=True, help_text="Используйте только латиницу, цифры, дефисы и подчеркивания")

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField("Название тега", max_length=100, unique=True)
    slug = models.SlugField("URL-адрес (slug)", max_length=110, unique=True, help_text="Используйте только латиницу, цифры, дефисы и подчеркивания")

    class Meta:
        verbose_name = "Тег"
        verbose_name_plural = "Теги"

    def __str__(self):
        return self.name

# --- Основная модель Статьи ---

class Article(models.Model):
    title = models.CharField("Заголовок", max_length=255)
    slug = models.SlugField("URL-адрес (slug)", max_length=265, unique=True, help_text="Используйте только латиницу, цифры, дефисы и подчеркивания")
    
    author = models.CharField("Автор", max_length=100) # В будущем можно заменить на ForeignKey к пользователю
    
    main_image = models.ImageField("Главное изображение", upload_to='article_images/', help_text="Это изображение будет на карточке статьи в общем списке.")
    video_url = models.URLField("Ссылка на видео (YouTube, Vimeo)", blank=True, null=True, help_text="Если указано, вместо изображения будет показано видео.")

    # Используем RichTextField для основного контента статьи
    content = RichTextField("Содержимое статьи")

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, verbose_name="Категория")
    tags = models.ManyToManyField(Tag, blank=True, verbose_name="Теги")

    is_pinned = models.BooleanField("Закрепить статью?", default=False, help_text="Закрепленная статья будет показана в большом блоке наверху.")
    
    created_at = models.DateTimeField("Дата создания", default=timezone.now)

    views = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Статья"
        verbose_name_plural = "Статьи"
        ordering = ['-created_at']

    def __str__(self):
        return self.title
