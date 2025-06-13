from extensions import db

class Carrinho(db.Model):
    __tablename__ = 'carrinhos'

    id = db.Column(db.Integer, primary_key=True)
    users_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    itens = db.relationship('ItemCarrinho', backref='carrinho', cascade="all, delete")