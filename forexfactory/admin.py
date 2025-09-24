from django.contrib import admin
from .models import ForexEvent

@admin.register(ForexEvent)
class ForexEventAdmin(admin.ModelAdmin):
    list_display = ('event_date', 'event_time', 'currency', 'event_name', 'impact')
    list_filter = ('event_date', 'currency', 'impact')
    search_fields = ('event_name',)
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('event_date', 'event_time', 'currency', 'impact', 'event_name', 'event_type')
        }),
        ('Значения', {
            'fields': ('actual', 'forecast', 'previous')
        }),
        ('Детальное описание (Specs)', {
            'classes': ('collapse',), # Секция будет по умолчанию свернута
            'fields': (
                'source', 
                'source_url',
                'measures', 
                'usual_effect', 
                'frequency', 
                'next_release', 
                'ff_notes', 
                'why_traders_care',
                'derived_via',
                'also_called',
                'acro_expand'
            ),
        }),
    )
