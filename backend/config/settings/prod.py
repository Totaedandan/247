# backend/config/settings/prod.py
from .base import *  # noqa
DEBUG = False
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["example.com"])
