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

            if p['cur']+add < p[limit] and add <= self.fn and p[factor] > best_pop and ix != len(self.points):
                best_pop = p[factor]
                best_index = ix
                best_add = add

        if best_index >= 0:
            self.points[best_index]['cur'] += best_add
            self.fn -= best_add
            print ('fn a2b: %d' % self.fn)
            return True
        else:
            return False

    def __init__(self, sr, q):
        self.query = q
        self.points = json.loads(sr.routeData)
        self.fn = q["duration"]-5  # free nights
        self.roundtrip = True if self.points[0] == self.points[-1] else False
        print ('fn init: %d' % self.fn)
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

        self.points[0]['cur'] = 2
        self.points[-1]['cur'] = 2

        selected_cats = []
        for c in self.categories:
            if c in q['activitiesGroup'] and q['activitiesGroup'][c] is True:
                self.addToBest(c, 'rmx')
                if c not in selected_cats:
                    selected_cats.append(c)

        if 'pace' in q and q['pace']==1:  # if pace == fast
            res = True
            while self.fn > 0 and res is True:
                res = self.addToBest('pop', 'rmn')

        res = True
        while self.fn > 0 and res is True:
            res = self.addToBest('pop', 'rmx')

        # evaluate result
        relevance = 0
        if len(selected_cats) > 0:
            for c in selected_cats:
                for p in self.points:
                    relevance += p[c]*p['cur']
            relevance = relevance / q['duration'] / len(selected_cats)

        else:
            for p in self.points:
                relevance+=p['pop']*p['cur']
            relevance = relevance / q['duration']

        self.relevance = relevance

        real_length = 0
        for p in self.points:
            if p['cur']>0:
                real_length+=1
        self.real_pace = q['duration']/real_length


    def get_report(self):
        text = 'R: '+str(self.relevance)+' P: '+str(self.real_pace)+' | '
        for p in self.points:
            if p['cur']>0:
                text += "%s: %d, " % (p['text'], p['cur'])
        return (text)
