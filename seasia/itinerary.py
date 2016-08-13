import json
from .models import Point


class Itinerary():

    categories = ['rtBch', 'rtHst', 'rtNat', 'rtClt', 'rtKid', 'rtDiv', 'rtShp', 'rtFod', 'rtNlf']

    def addToBest(self, factor, limit):
        best_index = -1
        best_pop = 0
        best_add = 0

        for ix, p in enumerate(self.points):
            add = 1

            if p['cur'] == 0:
                add = p['min']

            if p['cur']+add < p[limit] and add <= self.fn and p[factor] > best_pop:
                best_pop = p[factor]
                best_index = ix
                best_add = add

        if best_index >= 0:
            self.points[best_index]['cur'] += best_add
            self.fn -= best_add
            return True
        else:
            return False

    def __init__(self, sr, q):
        self.query = q
        self.points = json.loads(sr.routeData)
        self.fn = q["duration"]-3  # free nights
        for p in self.points:

            if "must" in p:
                p['cur'] = p['must']
                self.fn = self.fn - p['must']
            else:
                p['cur'] = 0

            dbp = Point.query.get(p['id'])
            p['pop'] = dbp.pointPop
            p['min'] = dbp.absMin
            p['rmn'] = dbp.recMin
            p['rmx'] = dbp.recMax

            for c in self.categories:
                p[c] = getattr(dbp, c)

            for key, val in q['activitiesGroup'].items():
                if val:
                    p['pop'] += p[key]

        self.points[0]['cur'] = 1
        self.points[-1]['cur'] = 1

        for c in self.categories:
            if c in q['activitiesGroup'] and q['activitiesGroup'][c] is True:
                self.addToBest(c, 'rmx')

        if 'pace' in q and q['pace']==1:  # if pace == fast
            print ('1st pass')
            res = True
            while self.fn > 0 and res is True:
                res = self.addToBest('pop', 'rmn')

        res = True
        while self.fn > 0 and res is True:
            res = self.addToBest('pop', 'rmx')


    def get_report(self):
        text = '>>> '
        for p in self.points:
            if p['cur']>0:
                text += "%s: %d, " % (p['text'], p['cur'])
        return (text)
