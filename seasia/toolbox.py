import hashlib
from datetime import datetime
from flask import render_template, current_app, request,session

def get_hash(s):
    hsh = hashlib.md5()
    hsh.update(s.encode("utf-8"))
    return hsh.hexdigest()


def create_marker(req):

    #print (req.remote_addr)
    ip = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
    base = ip+"|"+req.headers.get("User-Agent")+"|"+datetime.now().strftime('%y%m%d%H%M%S')
    #hsh = hashlib.md5()
    #hsh.update(base.encode("utf-8"))
    #return hsh.hexdigest()
    return base


def copysome(objfrom, objto, names):
    for n in names:
        if hasattr(objfrom, n):
            v = getattr(objfrom, n)
            setattr(objto, n, v);

# def mark_newcomer(entry, label=''):
#     session['entry']=entry
#     session['label'] = label
    
#     if 'marker' not in session.keys():
#         marker = create_marker(request)
#         session['marker']=marker
#         LandingLog.write('new')
#     else:
#         LandingLog.write('int')