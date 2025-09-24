from django.contrib import admin
from .models import (
    PropFirm, Platform, AccountSize, Budget, 
    TraderExperience, TradingStyle, Tag
)

# Регистрируем вспомогательные модели, чтобы их можно было заполнять
admin.site.register(Platform)
admin.site.register(AccountSize)
admin.site.register(Budget)
admin.site.register(TraderExperience)
admin.site.register(TradingStyle)
admin.site.register(Tag)

# Настраиваем отображение основной модели
@admin.register(PropFirm)
class PropFirmAdmin(admin.ModelAdmin):
    list_display = ('name', 'rating', 'price')
    list_filter = ('platforms', 'rating')
    search_fields = ('name',)
    # Используем filter_horizontal для удобного выбора ManyToMany полей
    filter_horizontal = (
        'platforms', 'account_sizes', 'budgets', 
        'trader_experiences', 'trading_styles', 'tags'
    )
