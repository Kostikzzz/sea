import json
from .models import Point


class Itinerary():

    categories = ['rtBch', 'rtHst', 'rtNat', 'rtClt', 'rtKid', 'rtDiv', 'rtShp', 'rtFod', 'rtNlf']

    def addToBest(factor, limit):
        pass

    def __init__(self, sr, q):
        self.query = q
        self.points = json.loads(sr.routeData)
        for p in self.points:
            p['cur'] = 0
            dbp = Point.query.get(p['id'])
            p['pop'] = dbp.pointPop
            for c in self.categories:
                p[c] = getattr(dbp, c)
            for key, val in q['activitiesGroup'].items():
                if val:
                    p['pop'] += p[key]

        self.fn = q["duration"]-3  # free nights

        self.points[0]['cur'] = 1
        self.points[-1]['cur'] = 1

        self.best_index = -1
        self.best_pop = 0

    def get_report(self):
        text = ''
        for p in self.points:
            text += "< %s ><br/>" % p['text']
        for k, v in self.query.items():
            text += "[ %s->%s <br/>]" % (k, str(v))
        return (text)
