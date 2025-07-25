from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    user_type = db.Column(db.String(50), nullable=False) # Elderly or Family

class FamilyMember(db.Model):
    __tablename__ = 'family_members'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    elderly_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    relationship = db.Column(db.String(50))

class Request(db.Model):
    __tablename__ = 'requests'
    id = db.Column(db.Integer, primary_key=True)
    assigned_family_member_id = db.Column(db.Integer, db.ForeignKey('family_members.id'))

class Match(db.Model):
    __tablename__ = 'matches'
    id = db.Column(db.Integer, primary_key=True)
    family_member_id = db.Column(db.Integer, db.ForeignKey('family_members.id'), nullable=False)
