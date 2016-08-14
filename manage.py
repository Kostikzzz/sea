#manage.py

from flask.ext.script import Manager
from seasia import app
from seasia.db import db
from seasia.mailer import Mailer
from seasia.models import Route, Country, Point, Geo
import json

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



if __name__ == "__main__":
    manager.run()
