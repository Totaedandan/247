from rest_framework import serializers
from .models import PropFirm

class PropFirmSerializer(serializers.ModelSerializer):
    # Используем StringRelatedField, чтобы в API отдавались названия, а не ID
    platforms = serializers.StringRelatedField(many=True)
    account_sizes = serializers.StringRelatedField(many=True)
    budgets = serializers.StringRelatedField(many=True)
    trader_experiences = serializers.StringRelatedField(many=True)
    trading_styles = serializers.StringRelatedField(many=True)
    tags = serializers.StringRelatedField(many=True)

    # Преобразуем текст с плюсами и минусами в список
    pros_list = serializers.SerializerMethodField()
    cons_list = serializers.SerializerMethodField()

    class Meta:
        model = PropFirm
        fields = '__all__'

    def get_pros_list(self, obj):
        return [pro.strip() for pro in obj.pros.splitlines() if pro.strip()]

    def get_cons_list(self, obj):
        return [con.strip() for con in obj.cons.splitlines() if con.strip()]