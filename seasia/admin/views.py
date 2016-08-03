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
    else:
        q = request.json
        res={}
        if q['action']=='getTableData':
            points = Point.query.all()
            res['tableData']=[]
            for p in points:
                res['tableData'].append(p.getDict())
            res['tableColumns']=p.fields
            res['status']='ok'
        return json.dumps(res)