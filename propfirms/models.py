from django.db import models

# --- Вспомогательные модели для фильтров ---

class Platform(models.Model):
    name = models.CharField("Название платформы", max_length=100, unique=True)
    def __str__(self):
        return self.name

class AccountSize(models.Model):
    name = models.CharField("Размер счета", max_length=50, unique=True) # например, "$5k-$25k"
    order = models.PositiveIntegerField("Порядок", default=0) # для сортировки
    class Meta:
        ordering = ['order']
    def __str__(self):
        return self.name

class Budget(models.Model):
    name = models.CharField("Бюджет", max_length=50, unique=True) # например, "До $100"
    order = models.PositiveIntegerField("Порядок", default=0)
    class Meta:
        ordering = ['order']
    def __str__(self):
        return self.name

class TraderExperience(models.Model):
    name = models.CharField("Опыт трейдера", max_length=50, unique=True)
    def __str__(self):
        return self.name

class TradingStyle(models.Model):
    name = models.CharField("Стиль торговли", max_length=50, unique=True)
    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField("Тег", max_length=100, unique=True) # например, "Diamond", "Verified", "1-Phase"
    def __str__(self):
        return self.name

# --- Основная модель Проп-фирмы ---

class PropFirm(models.Model):
    name = models.CharField("Название фирмы", max_length=200)
    logo = models.ImageField("Логотип", upload_to='prop_logos/', blank=True, null=True)
    rating = models.DecimalField("Рейтинг", max_digits=2, decimal_places=1, help_text="Например, 4.9")
    price = models.DecimalField("Цена от", max_digits=10, decimal_places=2)
    details_url = models.URLField("Ссылка на 'Подробнее'", max_length=500, blank=True)
    
    # Связи с фильтрами
    platforms = models.ManyToManyField(Platform, verbose_name="Платформы")
    account_sizes = models.ManyToManyField(AccountSize, verbose_name="Размеры счетов")
    budgets = models.ManyToManyField(Budget, verbose_name="Бюджеты")
    trader_experiences = models.ManyToManyField(TraderExperience, verbose_name="Опыт трейдера")
    trading_styles = models.ManyToManyField(TradingStyle, verbose_name="Стили торговли")
    tags = models.ManyToManyField(Tag, verbose_name="Теги", blank=True)
    
    # Текстовые поля для плюсов и минусов (каждый с новой строки)
    pros = models.TextField("Плюсы", help_text="Каждый плюс с новой строки")
    cons = models.TextField("Минусы", help_text="Каждый минус с новой строки")

    class Meta:
        verbose_name = "Проп-фирма"
        verbose_name_plural = "Проп-фирмы"
        ordering = ['-rating'] # По умолчанию сортируем по рейтингу

    def __str__(self):
        return self.name
