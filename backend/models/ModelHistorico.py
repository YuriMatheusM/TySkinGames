from extensions import db;

class ModelHistorico(db.Model):
        __tablename__="Historico"

        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
        produto_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
        preco_unitario = db.Column(db.Float, nullable=False)
        data_compra = db.Column(db.DateTime, server_default=db.func.now())

        usuario = db.relationship("ModelUsers", backref="compras")
        produtos = db.relationship("ModelProduct", backref="compras")