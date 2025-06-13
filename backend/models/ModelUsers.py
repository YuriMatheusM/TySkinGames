from extensions import db
from werkzeug.security import check_password_hash

class ModelUsers(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    senha = db.Column(db.String(200), nullable=False)
    foto = db.Column(db.String(200), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "nome": self.nome,
            "email": self.email,
            "foto": self.foto
        }
    def set_senha(self, senha):
        self.senha= senha

    def verify_senha(self, senha):
        return check_password_hash(self.senha, senha)
    
