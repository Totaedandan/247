from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=200)
    published_at = models.DateTimeField(auto_now_add=True)
    # Добавьте другие поля по необходимости: content, author и т.д.

    def __str__(self):
        return self.title

class EconomicEvent(models.Model):
    name = models.CharField(max_length=255)
    event_date = models.DateField()
    event_time = models.TimeField()
    volatility = models.CharField(max_length=50) # 'Высокая', 'Средняя' и т.д.

    def __str__(self):
        return self.name

class Trend(models.Model):
    name = models.CharField(max_length=100)
    posts_count = models.IntegerField()
    change_percent = models.CharField(max_length=10) # '+4.2%', '-0.7%'

    def __str__(self):
        return self.name

class Tweet(models.Model):
    tweet_id = models.CharField(max_length=100, unique=True)
    author = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField()
    # Добавьте поле для медиа, если нужно