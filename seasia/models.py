from .db import db

class Geo(db.Model):
    __tablename__='geos'
    id = db.Column(db.Integer, primary_key = True)
    name=db.Column(db.String(50) )
    formatted_address=db.Column(db.Text)
    country_id = db.Column(db.Integer, db.ForeignKey('countries.id'))
    UFI = db.Column(db.Integer)
    number = db.Column(db.Integer)
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    google_place_id=db.Column(db.String(50) )
    point = db.relationship('Point', backref='geo', lazy='dynamic')

class Country(db.Model):
    __tablename__='countries'
    id = db.Column(db.Integer, primary_key = True)
    name=db.Column(db.String(100))
    code=db.Column(db.String(2))
    geos = db.relationship('Geo', backref='country', lazy='dynamic')


class Point(db.Model):
    __tablename__='points'
    id = db.Column(db.Integer, primary_key = True)
    pointName=db.Column(db.String(50))
    geoId=db.Column(db.Integer, db.ForeignKey('geos.id'))
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

    fields = ['id','pointName','pointPop','absMin','absMax','recMin','recMax', 'rtKid','rtShp','rtFod','rtDiv','rtNat','rtClt','rtHst','rtBch','rtNlf']

    def getDict(self):
        res={}
        for f in self.fields:
            res[f]=getattr(self, f)
        return res



class Superroute(db.Model):
    __tablename__='superroutes'
    id = db.Column(db.Integer, primary_key = True)
    name=db.Column(db.String(100))
    data=db.Column(db.Text)
    start_point=db.Column(db.Integer, db.ForeignKey('points.id'))
    end_point=db.Column(db.Integer, db.ForeignKey('points.id'))