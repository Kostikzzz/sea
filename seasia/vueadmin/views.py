from flask import render_template, request, abort, redirect, url_for, session
from flask.ext.login import current_user, login_required, login_user, logout_user
from . .db import db
from . .social.models import User
from . import vueadmin
import json

from . .models import Geo, Point
from sqlalchemy import desc


def relogin(u):
    session.pop('google_token', None)
    session.pop('facebook_token', None)
    logout_user()
    login_user(u)

@vueadmin.route('/vueadmin', methods=['GET'])
@login_required
def admin_main():
    return render_template('vueadmin_main.html',wrk=[{"nickname":"test", "id":0}])


    # if current_user.is_admin() or current_user.worker==1:
    #     wrk = User.query.filter_by(worker=1)
    #     return render_template('admin_main.html', wrk=wrk)
    # else:
    #     return render_template('404.html')

@vueadmin.route('/worker/login/<wid>', methods=['GET'])
@login_required
def worker_login(wid):
    try:
        u = User.query.filter_by(id = wid).first()
    except:
        return redirect(url_for('root'))

    if (current_user.is_admin() or current_user.worker==1) and u.worker == 1:
        relogin(u)
    return redirect(url_for('vueadmin.admin_main'))



@vueadmin.route('/post-admin-tables', methods=['POST'])
@login_required
def post_admin_tables():
    if current_user.is_admin():
        res={}
        query = request.json


        if query['cmd']=='getTable':
            if query['tid']=='geosTable':
                geos = Geo.query.all()
                res['tableRows']=[]
                res['tableHeader']=['Name','Address', 'Number', 'Country']
                for g in geos:
                    res['tableRows'].append([g.name, g.formatted_address, g.number, g.country.name])
                res['status']='ok'
            elif query['tid']=='pointsTable':
                points = Point.query.all()
                res['tableRows']=[]
                res['tableHeader']=['Id','Name','GEO']
                for p in points:
                    res['tableRows'].append([p.id, p.pointName, p.geo.name])
                res['status']='ok'
            else:
                res['status']='unknown table'
        else:
            res['status']='unknown command'


    else:
        res= {'status':'unauthorized'}
    return json.dumps(res)

@vueadmin.route('/post-admin-forms', methods=['POST'])
@login_required
def post_admin_forms():
    if current_user.is_admin():
        res={}
        query = request.json['data']
        if query['op']=='addPoint':
            p = Point()
            # p.pointName = query['data']['pointName']
            p.geoId = query['data']['geoId']
            for f in Point.get_external_fields():
                if f!='id': setattr(p, f, query['data'][f]) 
            db.session.add(p)
            db.session.commit()

    return json.dumps({"status":"ok"})


@vueadmin.route('/post-admin-data', methods=['POST'])
@login_required
def post_admin_data():
    if current_user.is_admin():
        res={}
        query = request.json

        if query['op']=='getValues':
            pid = query['dataID']
            p = Point.query.get(pid)
            res['status']='ok'
            res['fields']=[]
            for f in Point.get_external_fields():
                res['fields'].append({"field":f, "data":getattr(p,f)})
            res['fields'].append({"field":'geopointAc',"data":{'id':p.geo.id, 'name':p.geo.name} })

        elif query['op']=='saveEdited':
            res['status']='ok'
            pid = query['dataID']
            p = Point.query.get(pid)
            for key, value in query['fields'].items():
                if value:
                    setattr(p, key, value)
            geo_id = query['fields']['geopointAc']['id']
            print ('>>>>>'+str(geo_id))
            if geo_id !=-1: p.geoId=geo_id
            db.session.add(p)
            db.session.commit()
        return json.dumps(res)

@vueadmin.route('/post-geopoints', methods=['POST'])
@login_required
def post_geopoints():
    if current_user.is_admin():
        res={}
        query = request.json

        if query['cmd']=="getAutocomplete":
            geos=Geo.query.filter(Geo.name.startswith(query['string'])).order_by(desc('number')).limit(10)

        res['geos']=[]
        for g in geos:
            res['geos'].append({"name":g.name, "id":g.id})
        res['status']='ok'

    else:
        res['status']="unauthorized"

    return json.dumps(res)




