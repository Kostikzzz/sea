import json
from .models import Point, Transfer


def share_items(l1,l2):
    res = False
    for i in l1:
        print ('item '+i)
        if i.lower() in l2:
            print ('shared' +i)
            res = True
    return res


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

            if (p['cur']+add < p[limit] and add <= self.fn and
                    p[factor] > best_pop and ix != len(self.points) and
                    not p['dbl']):

                best_pop = p[factor]
                best_index = ix
                best_add = add

        if best_index >= 0:
            self.points[best_index]['cur'] += best_add
            self.fn -= best_add
            #print ('fn a2b: %d' % self.fn)
            return True
        else:
            return False

    def __init__(self, sr, q):
        self.query = q
        self.points = json.loads(sr.routeData)
        self.name = sr.name
        self.countries = json.loads(sr.countries)
        self.fn = q["duration"]-1  # free nights
        self.duration = q["duration"]
        self.pace = q["pace"]

        #self.roundtrip = True if self.points[0] == self.points[-1] else False
        #print ('fn init: %d' % self.fn)

        used_points = []
        for p in self.points:

            # if "must" in p:
            #     p['cur'] = p['must']
            #     self.fn = self.fn - p['must']
            # else:
            #     p['cur'] = 0


            dbp = Point.query.get(p['id'])
            p['pop'] = dbp.pointPop
            p['min'] = dbp.absMin
            p['rmn'] = dbp.recMin
            p['rmx'] = dbp.recMax
            p['max'] = dbp.absMax

            for c in self.categories:
                p[c] = getattr(dbp, c)

            for key, val in q['activitiesGroup'].items():
                if val:
                    p['pop'] += p[key]

            
            if p['id'] in used_points:
                p['dbl']=True
                #p['cur'] = 
                substract = p['min']
            else:
                p['dbl']=False
                substract = p['rmn'] if self.pace == 0 else p['min']
                used_points.append(p['id'])
            if 'skip' in p and p['skip']:
                substract = 0
            
            p['cur'] = substract
            self.fn -= substract 

        #self.points[0]['cur'] = 2
        #self.points[-1]['cur'] = 2
        self.pace = q['pace']

        selected_cats = []
        for c in self.categories:
            if c in q['activitiesGroup'] and q['activitiesGroup'][c] is True:
                self.addToBest(c, 'rmx')
                if c not in selected_cats:
                    selected_cats.append(c)



        #if self.pace==1:  # if pace == fast
        # res = True
        # while self.fn > 0 and res is True:
        #     res = self.addToBest('pop', 'rmn')

        res = True
        while self.fn > 0 and res is True:
            res = self.addToBest('pop', 'rmx')

        res = True
        while self.fn > 0 and res is True:
            res = self.addToBest('pop', 'max')


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
        self.real_pace = (q['duration']-1)/real_length

    def is_shorty(self):
        points = [p for p in self.points if p['cur']>0]
        if (len(points) == 2) and (points[0]['id'] == points[1]['id']):
            return True
        else:
            return False



    def get(self):

        # delete empty points
        #self.points = [p for p in self.points if p['cur']>0]

        for p in self.points:
            if p['cur']==0:
                self.points.remove(p)

        disabled = []
        for k, v in self.query['countriesGroup'].items():
            if not v:
                disabled.append(k)

        print (disabled)

        accept = False
        status = ''

        if (not share_items(self.countries, disabled) and 
                (not self.is_shorty())):
            if  self.relevance >=1.8 and self.fn == 0:
                if self.pace==0 and self.real_pace >3.5:
                    accept = True
                elif self.pace==1 and self.real_pace <=3.5:
                    accept = True


        if accept:
            print ('accept true')
            res = {}
            res['points']=[]
            rd=[]
            day = 1
            i=0
            for p1, p2 in zip([0]+self.points, self.points):
                if p2['cur'] > 0:
                    rd.append(p2['text'])
                    if i!=0:
                        t = Transfer.query.filter(Transfer.p1_id==p1['id'], Transfer.p2_id==p2['id']).first()
                        if t:
                            ttype = "Transfer" if not t.night else "Night transfer"
                            transfer={
                                'desc':'%s from %s to %s' % 
                                            (ttype, p1['text'], p2['text']),
                                'comment':t.comment,
                                'day':day}

                            if t.night: 
                                day+=1
                        else:
                            transfer={'desc':'Not set'}
                        
                    else:
                        transfer = {
                            'desc': "You arrive in %s" % p2['text'],
                            'day':day,
                            'comment':''
                        }
                    if i==len(self.points)-1:
                        post = 'You depart from %s' % p2['text']
                    else:
                        post = ''
                    res['points'].append({
                        'name': p2['text'],
                        'id': p2['id'],
                        'nights': p2['cur'],
                        'day': day,
                        'transfer':transfer,
                        'post':post
                    })
                    day += p2['cur']
                i+=1

            res['desc']=' - '.join(rd)
            res['name']= self.name
            res['duration'] = self.duration
            res['status']=status



        else:
            print ('accept false')
            res = False

        return res



