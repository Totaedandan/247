from django.db import models

class ForexEvent(models.Model):
    # Основные данные для таблицы
    event_date = models.DateField("Дата события")
    event_time = models.TimeField("Время события (МСК)", blank=True, null=True)
    currency = models.CharField("Валюта", max_length=10)
    impact = models.CharField("Влияние", max_length=10, choices=[('High', 'Высокое'), ('Medium', 'Среднее'), ('Low', 'Низкое')])
    event_name = models.CharField("Название события", max_length=255)
    
    actual = models.CharField("Факт.", max_length=20, blank=True)
    forecast = models.CharField("Прогноз", max_length=20, blank=True)
    previous = models.CharField("Пред.", max_length=20, blank=True)
    
    # --- НОВЫЕ И ОБНОВЛЕННЫЕ ПОЛЯ ДЛЯ ДЕТАЛЕЙ ---
    source = models.CharField("Source", max_length=255, blank=True)
    source_url = models.URLField("Source URL", max_length=500, blank=True)
    measures = models.TextField("Measures", blank=True)
    usual_effect = models.TextField("Usual Effect", blank=True)
    frequency = models.CharField("Frequency", max_length=255, blank=True)
    next_release = models.CharField("Next Release", max_length=100, blank=True)
    ff_notes = models.TextField("FF Notes", blank=True)
    why_traders_care = models.TextField("Why Traders Care", blank=True)
    derived_via = models.TextField("Derived Via", blank=True)
    also_called = models.CharField("Also Called", max_length=255, blank=True)
    acro_expand = models.CharField("Acro Expand", max_length=255, blank=True)
    
    # Поле для фильтра по типу события (остается без изменений)
    event_type = models.CharField("Тип события", max_length=50, blank=True)
    
    class Meta:
        verbose_name = "Событие Forex Factory"
        verbose_name_plural = "События Forex Factory"
        ordering = ['event_date', 'event_time']

    def __str__(self):
        return f"{self.event_date} | {self.currency} | {self.event_name}"
