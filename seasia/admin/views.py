from flask import render_template, request, abort, redirect, url_for, session
from flask.ext.login import current_user, login_required, login_user, logout_user
from . .db import db
from . .social.models import User
from . import admin
import json

from . .models import Geo, Point, Route
from sqlalchemy import desc

@admin.route('/admin/points', methods=['GET','POST'])
def admin_points():
    if request.method=='GET':
        return render_template('admin_points.html')
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
            res['tableColumns']=Point.fields()
            res['tableColumns'].append('country')
            res['status']='ok'

        elif q['action']=='getFormData':
            point = Point.query.get(q['data_id'])
            res['formData']=point.getList()
            res['status']='ok'

        elif q['action']=='getAutocomplete':
            geos=Geo.query.filter(Geo.name.startswith(q['string'])).order_by(desc(Geo.number)).limit(12)
            res={}
            res['data']=[]
            for g in geos:
                res['data'].append({"name":g.name, "id":g.id})
            res['status']='ok'

        elif q['action']=='saveFormData':
            if q['data_id']>0:
                p = Point.query.get(q['data_id'])
                
            else:
                p=Point()

            for f in Point.fields():
                if f in q['formData']:
                    setattr(p, f, q['formData'][f])

            db.session.add(p)
            db.session.commit()
            res['status']='ok'


        return json.dumps(res)

@admin.route('/admin/routes', methods=['GET','POST'])
def admin_routes():
    if request.method=='GET':
        return render_template('admin_routes.html')
    elif request.method=='POST':
        q = request.json
        res={}

        if q['action']=='getTableData':
            routes = Route.query.all()
            res['tableData']=[]
            for r in routes:
                data = r.getDict()
                res['tableData'].append(data)
            res['tableColumns']=Route.fields()
            res['status']='ok'

        elif q['action']=='getFormData':
            route = Route.query.get(q['data_id'])
            res['formData']=route.getList()
            for d in res['formData']:
                if d['mark']=="routeData":
                    d['data']=json.loads(d['data'])

            res['status']='ok'

        elif q['action']=='getAutocomplete':
            points=Point.query.filter(Point.pointName.startswith(q['string'])).limit(12)
            res={}
            res['data']=[]
            for p in points:
                print(p.pointName)
                res['data'].append({"name":p.pointName, "id":p.id})
            res['status']='ok'

        elif q['action']=='saveFormData':
            if q['data_id']>0:
                r = Route.query.get(q['data_id'])
                
            else:
                r=Route()

            for f in Route.fields():
                if f in q['formData']:
                    if q['data_id'] == -1 and f == 'id':
                        pass
                    elif f=='routeData':
                        setattr(r, f, json.dumps(q['formData']['routeData']))
                    else:
                        setattr(r, f, q['formData'][f])
  

            rd = q['formData']['routeData']
            print('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            print(rd)
            r.startPointId=rd[0]['id']
            r.startPointName=rd[0]['text']
            r.endPointId=rd[-1]['id']
            r.endPointName=rd[-1]['text']
            print(r.startPointName)


            db.session.add(r)
            db.session.commit()
            res['status']='ok'


        return json.dumps(res)

