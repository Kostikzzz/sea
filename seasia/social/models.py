from . .db import db
from flask.ext.login import UserMixin
from flask import session, url_for
from werkzeug.security import generate_password_hash, check_password_hash

from . .config import ADMIN_EMAILS
from datetime import datetime

# import os
# from . .path import ROOT_DIR, UPLOAD_FOLDER, AVATAR_FOLDER
from . .logger import StrangersLog


class PrivateMessage(db.Model):
    __tablename__ = "private_messages"
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text)
    user_from = db.Column(db.ForeignKey('users.id'))
    user_to = db.Column(db.ForeignKey('users.id'))
    timestamp = db.Column(db.DateTime)

    def __init__(self, user_to, text):
        self.timestamp = datetime.utcnow()
        self.text = text
        self.user_to = user_to



class UsersRelationship(db.Model):

    __tablename__ = 'users_relationships'
    id = db.Column(db.Integer, primary_key=True)
    user1 = db.Column(db.ForeignKey('users.id'))
    is_friend_to = db.Column(db.Boolean, default=False)
    follows = db.Column(db.Boolean, default=False)
    can_send_pm_to = db.Column(db.Boolean, default=True)
    user2 = db.Column(db.ForeignKey('users.id'))

class User (UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    register_email = db.Column(db.String(100), unique=True)
    contact_email = db.Column(db.String(100))
    contact_email_accepted = db.Column(db.Boolean, default = False)
    g_username = db.Column(db.String(50))
    f_username = db.Column(db.String(50))
    vk_username = db.Column(db.String(50))
    nickname = db.Column(db.String(50))
    password_hash = db.Column(db.String(64))
    # email = db.Column(db.String(100), unique=True)
    google_id =db.Column(db.String(255), unique=True)
    facebook_id =db.Column(db.String(255), unique=True)
    vk_id =db.Column(db.String(255), unique=True)
    image =db.Column(db.String(250), unique=True)
    last_login = db.Column(db.DateTime)
    worker = db.Column(db.Boolean, default = False)

    private_messages_from = db.relationship('PrivateMessage', backref='sender', lazy='dynamic', foreign_keys='PrivateMessage.user_from')
    private_messages_to = db.relationship('PrivateMessage', backref='recipient', lazy='dynamic', foreign_keys='PrivateMessage.user_to')
    users_relationships = db.relationship('UsersRelationship', backref='user', lazy='dynamic', foreign_keys='UsersRelationship.user1')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def register(username, password):
        user = User(username=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def register_google_user(username, email, google_id):
        if username == '':
            username = email
        user = User(g_username=username, nickname=username, register_email=email, contact_email=email, google_id=google_id, contact_email_accepted=True)
        db.session.add(user)
        db.session.commit()
        StrangersLog.write('google_sign_up')
        return user

    @staticmethod
    def register_facebook_user(username, email, facebook_id):
        if username == '':
            username = email
        user = User(f_username=username, nickname=username, register_email=email, contact_email=email, facebook_id=facebook_id, contact_email_accepted=True)
        db.session.add(user)
        db.session.commit()
        StrangersLog.write('fb_sign_up')
        return user

    def __repr__(self):
        return '<User {0}>'.format(self.nickname)


    def get_email_status(self):
        extra=''
        if self.contact_email_accepted:
            email = self.contact_email
            status = "ok"
            if self.contact_email == self.register_email:
                extra = 'not changed'
            else:
                extra = 'changed'
        else:
            email = self.register_email
            status = "not verified"
            extra = self.contact_email
        return {"email":email, "staus":status, "extra":extra}


    def is_admin(self):
        return (self.register_email in ADMIN_EMAILS)

    def send_private_message(self, user_to, text):
        pm = PrivateMessage(user_to, text)
        pm.user_from = self.id
        db.session.add(pm)
        db.session.commit()

    def get_contacted_users(self):
        #REBUILD IT
        contacted=[]
        #sent
        pms = PrivateMessage.query.filter(PrivateMessage.user_from==self.id)
        for m in pms:
            user_info={"name":m.recipient.nickname, "uid":m.recipient.id, "img":m.recipient.get_avatar()}
            if user_info not in contacted:
                contacted.append(user_info)
        #received
        pms = PrivateMessage.query.filter(PrivateMessage.user_to==self.id)
        for m in pms:
            user_info={"name":m.sender.nickname, "uid":m.sender.id, "img":m.sender.get_avatar()}
            if user_info not in contacted:
                contacted.append(user_info)

        return {"list":contacted, "length":len(contacted)}

    def get_avatar(self):
        image = self.image
        if not image:
            image='avatar_placeholder.png'
        return (url_for('social.static', filename='images/avatars/'+image))








