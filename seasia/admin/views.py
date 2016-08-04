from flask import render_template, request, abort, redirect, url_for, session
from flask.ext.login import current_user, login_required, login_user, logout_user
from . .db import db
from . .social.models import User
from . import admin
import json

from . .models import Geo, Point
from sqlalchemy import desc

@admin.route('/adminka', methods=['GET','POST'])
def admin_root():
    if request.method=='GET':
        return render_template('admin_root.html')
    elif request.method=='POST':
        q = request.json
        res={}

        if q['action']=='getTableData':
            points = Point.query.all()
            res['tableData']=[]
            for p in points:
                data = p.getDict()
                data['country']=p.geo.country.name
                res['tableData'].append(data)
            res['tableColumns']=p.fields()
            res['tableColumns'].append('country')
            res['status']='ok'

        elif q['action']=='getFormData':
            point = Point.query.get(q['data_id'])
            res['formData']=point.getList()
            res['status']='ok'

        elif q['action']=='getAutocomplete':
            geos=Geo.query.filter(Geo.name.startswith(q['string'])).order_by(desc(Geo.number)).limit(12)
            res={}
            res['geos']=[]
            for g in geos:
                res['geos'].append({"name":g.name, "id":g.id})
            res['status']='ok'

        return json.dumps(res)