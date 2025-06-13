from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import pymysql
from models.ModelUsersAdmin import ModelUserAdmin
from models.ModelProduct import ModelProduct
from models.ModelUsers import ModelUsers
from models.ModelCart import Carrinho
from models.ModelItensCart import ItemCarrinho
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
from datetime import timedelta
from extensions import db
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token, get_jwt_identity
)
from werkzeug.security import generate_password_hash
import uuid
from dotenv import load_dotenv
import os

load_dotenv()
pymysql.install_as_MySQLdb()

app = Flask(__name__)
CORS(app, supports_credentials=True)
create_access_token

#configuração do banco de dados
#app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:yuri1605@localhost:3306/tyskinshop"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

#configuração do JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt = JWTManager(app)


UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

UPLOAD_FOLDER_USER = 'static/perfil'
os.makedirs(UPLOAD_FOLDER_USER, exist_ok=True)
app.config['UPLOAD_FOLDER_USER'] = UPLOAD_FOLDER_USER

ADMIN_KEY = os.getenv('ADMIN_KEY')

@app.route("/adicionarItens", methods=['POST'])
def adicionar_item():
    # Simulando um usuário fixo para teste
    usuario_id = 1  # Altere conforme um usuário válido no seu banco

    data = request.get_json()
    print("DEBUG DATA:", data)

    if not data or 'products_id' not in data:
        return jsonify({'error': 'O campo products_id é obrigatório.'}), 422

    products_id = data['products_id']

    carrinho = Carrinho.query.filter_by(users_id=usuario_id).first()
    if not carrinho:
        return jsonify({'error': 'Carrinho não encontrado'}), 404

    item_existente = ItemCarrinho.query.filter_by(
        carrinho_id=carrinho.id,
        products_id=products_id
    ).first()

    if item_existente:
        return jsonify({'message': 'Produto já está no carrinho'}), 400

    novo_item = ItemCarrinho(
        carrinho_id=carrinho.id,
        products_id=products_id
    )
    db.session.add(novo_item)
    db.session.commit()

    return jsonify({'message': 'Produto adicionado ao carrinho'}), 201



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)