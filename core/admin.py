from django.contrib import admin
from .models import Article, EconomicEvent, Trend, Tweet

admin.site.register(Article)
admin.site.register(EconomicEvent)
admin.site.register(Trend)
admin.site.register(Tweet)