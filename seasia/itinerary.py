import json
from .models import Point


class Itinerary():

    categories = ['rtBch', 'rtHst', 'rtNat', 'rtClt', 'rtKid', 'rtDiv', 'rtShp', 'rtFod', 'rtNlf']

    def addToBest(self, factor, limit):
        best_index = -1
        best_pop = 0
        best_add = 0

        for ix, p in enumerate(self.points):
            #print ('checking %s : id %d' % (p['text'], ix))
            add = 1

            if p['cur'] == 0:
                add = p['rmn']

            if p['cur']+add < p[limit] and add <= self.fn and p[factor] > best_pop:
                best_pop = p[factor]
                best_index = ix
                best_add = add

        if best_index >= 0:
            self.points[best_index]['cur'] += best_add
            self.fn -= best_add
            print ('added %d nights to %s' % (best_add, self.points[best_index]['text']))
            print ('best_index %d' % best_index)
            return True
        else:
            return False

    def __init__(self, sr, q):
        self.query = q
        self.points = json.loads(sr.routeData)
        print ('NEW ===============================')
        for p in self.points:
            p['cur'] = 0
            dbp = Point.query.get(p['id'])
            p['pop'] = dbp.pointPop
            p['min'] = dbp.absMin
            p['rmn'] = dbp.recMin
            p['rmx'] = dbp.recMax

            for c in self.categories:
                p[c] = getattr(dbp, c)

            print (q['activitiesGroup'])
            for key, val in q['activitiesGroup'].items():
                if val:
                    p['pop'] += p[key]

        self.fn = q["duration"]-3  # free nights

        self.points[0]['cur'] = 1
        self.points[-1]['cur'] = 1

        for c in self.categories:
            if c in q['activitiesGroup'] and q['activitiesGroup'][c] is True:
                print('=========')
                self.addToBest(c, 'rmn')
                print('=========')



        print ('1st pass')
        res = True
        while self.fn > 0 and res is True:
            print ('fn: %d' % self.fn)
            res = self.addToBest('pop', 'rmn')
        print ('2nd pass')
        res = True
        while self.fn > 0 and res is True:
            print ('fn: %d' % self.fn)
            res = self.addToBest('pop', 'rmx')


    def get_report(self):
        text = ''
        for p in self.points:
            text += "< %s > : %d \n" % (p['text'], p['cur'])
        return (text)
