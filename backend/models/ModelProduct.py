from extensions import db

class ModelProduct(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.String(200), nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    preco = db.Column(db.Float, nullable=False)
    imagem = db.Column(db.String(200), nullable=True)
        

    def to_dict(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "descricao": self.descricao,
            "categoria": self.categoria,
            "preco": self.preco,
            "imagem": self.imagem
        }

