#manage.py

from flask.ext.script import Manager
from seasia import app
from seasia.db import db
from seasia.mailer import Mailer
from seasia.models import Route, Country, Point, Geo, Transfer
import json
#from itertools import zip

manager = Manager(app)

@manager.command
def mail_test():
    Mailer.welcome_mail()

@manager.command
def routes_to_countries():

    routes = Route.query.all()
    for r in routes:
        countries=[]
        points = json.loads(r.routeData)
        for p in points:
            dbp = Point.query.get(p['id'])
            name = dbp.geo.country.name
            if name not in countries:
                countries.append(name)
        r.countries = json.dumps(countries)
        db.session.add(r)
        db.session.commit()


def save_two_pairs(pair):

    def save_pair(pair):
        t = Transfer.query.filter(
            Transfer.p1_id==pair[0]['id'], 
            Transfer.p2_id==pair[1]['id']).first()
        if not t:
            nt = Transfer()
            nt.p1_id = pair[0]['id']
            nt.p2_id = pair[1]['id']
            nt.p1_name = pair[0]['text']
            nt.p2_name = pair[1]['text']
            nt.night = False
            db.session.add(nt)
            db.session.commit()

    save_pair(pair)
    pair[0],pair[1] = pair[1],pair[0]
    save_pair(pair)




@manager.command
def list_transfers():
    routes = Route.query.all()
    for r in routes:
        points = json.loads(r.routeData)
        [ save_two_pairs([p1,p2]) for p1, p2 in zip(points,points[1:])]




if __name__ == "__main__":
    manager.run()
