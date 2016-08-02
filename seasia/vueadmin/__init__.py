# admin __init__.py

from flask import Blueprint

vueadmin = Blueprint('vueadmin', __name__, static_folder = 'static', template_folder = 'templates',  static_url_path='/vueadmin/static')

from . import views

