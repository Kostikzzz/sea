from .db import db
import json


class Geo(db.Model):
    __tablename__ = 'geos'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    formatted_address = db.Column(db.Text)
    country_id = db.Column(db.Integer, db.ForeignKey('countries.id'))
    UFI = db.Column(db.Integer)
    number = db.Column(db.Integer)
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    google_place_id = db.Column(db.String(50))
    point = db.relationship('Point', backref='geo', lazy='dynamic')


class Country(db.Model):
    __tablename__ = 'countries'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    code = db.Column(db.String(2))
    geos = db.relationship('Geo', backref='country', lazy='dynamic')


class Point(db.Model):
    __tablename__ = 'points'
    id = db.Column(db.Integer, primary_key=True)
    pointName = db.Column(db.String(50))
    geoName = db.Column(db.String(50))
    geoId = db.Column(db.Integer, db.ForeignKey('geos.id'))
    pointPop = db.Column(db.Integer)
    absMin = db.Column(db.Integer)
    absMax = db.Column(db.Integer)
    recMin = db.Column(db.Integer)
    recMax = db.Column(db.Integer)
    rtBch = db.Column(db.Integer)
    rtHst = db.Column(db.Integer)
    rtClt = db.Column(db.Integer)
    rtNat = db.Column(db.Integer)
    rtDiv = db.Column(db.Integer)
    rtFod = db.Column(db.Integer)
    rtShp = db.Column(db.Integer)
    rtKid = db.Column(db.Integer)
    rtNlf = db.Column(db.Integer)
    starter = db.Column(db.Boolean, default=False)


    # ADMIN

    def fields():
        return ['id', 'pointName', 'geoName', 'geoId', 'pointPop', 'absMin', 'absMax', 'recMin', 'recMax', 'rtKid', 'rtShp', 'rtFod', 'rtDiv', 'rtNat', 'rtClt', 'rtHst', 'rtBch', 'rtNlf']

    def getDict(self):
        res = {}
        for f in Point.fields():
            res[f] = getattr(self, f)
        return res

    def getList(self):
        res = []
        for f in Point.fields():
            res.append({"mark": f, "data": getattr(self, f)})
        return res


class Route(db.Model):
    __tablename__ = 'routes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    routeData = db.Column(db.Text)
    startPointId = db.Column(db.Integer, db.ForeignKey('points.id'))
    endPointId = db.Column(db.Integer, db.ForeignKey('points.id'))
    startPointName = db.Column(db.String(50))
    endPointName = db.Column(db.String(50))
    countries = db.Column(db.Text)

    # itinerary = {
    #     "points": [],
    #     "best_index": -1,
    #     "best_pop": -1,
    #     "days": -1,
    #     "fn": -1
    # }

    def fields():
        return ['id', 'name', 'startPointName', 'endPointName', 'routeData', 'startPointId', 'endPointId']

    def getDict(self):
        res = {}
        for f in Route.fields():
            res[f] = getattr(self, f)
        return res

    def getList(self):
        res = []
        for f in Route.fields():
            res.append({"mark": f, "data": getattr(self, f)})
        return res

    #===============

class Transfer(db.Model):
    __tablename__ = 'transfers'
    id = db.Column(db.Integer, primary_key=True)
    p1_name = db.Column(db.String(50))
    p2_name = db.Column(db.String(50))
    comment = db.Column(db.Text)
    p1_id = db.Column(db.Integer)
    p2_id = db.Column(db.Integer)
    night = db.Column(db.Boolean)













