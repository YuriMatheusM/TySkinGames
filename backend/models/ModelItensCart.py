from extensions import db

class ItemCarrinho(db.Model):
    __tablename__ = 'itens_carrinho'
    id = db.Column(db.Integer, primary_key=True)
    carrinho_id = db.Column(db.Integer, db.ForeignKey('carrinhos.id'), nullable=False)
    products_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)

    products = db.relationship('ModelProduct')