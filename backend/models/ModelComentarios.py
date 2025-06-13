from extensions import db;

class ModelComentarios(db.Model):
    __tablename__ = "comentarios"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    text = db.Column(db.String(200), nullable=False)
    data = db.Column(db.DateTime, default=db.func.now())

    usuario = db.relationship("ModelUsers", backref="comentarios")

    def to_dict(self):
        return{
        "id": self.id,
        "user_name": self.usuario.username,
        "comentario": self.text,
        "data": self.data
        }
