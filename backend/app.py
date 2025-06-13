from flask_cors import CORS
import pymysql
from models.ModelUsersAdmin import ModelUserAdmin
from models.ModelComentarios import ModelComentarios
from models.ModelHistorico import ModelHistorico
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
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
#app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:yuri1605@localhost:3306/tyskinshop"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

#configuração do JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
jwt = JWTManager(app)


UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

UPLOAD_FOLDER_USER = 'static/perfil'
os.makedirs(UPLOAD_FOLDER_USER, exist_ok=True)
app.config['UPLOAD_FOLDER_USER'] = UPLOAD_FOLDER_USER

ADMIN_KEY = os.getenv('ADMIN_KEY')

#Rota inicial
@app.route('/')
def inicial():
    return "ta funcionando essa porra"

@app.route('/registrarAdmin', methods=['POST'])
def registrar_admin():
    username = request.form.get('username')
    nome = request.form.get('nome')
    email = request.form.get('email')
    senha = request.form.get('senha')
    admin_key = request.form.get('admin_key')
    foto = request.files.get('foto')

    if not all([username, nome, email, senha, admin_key]):
        return jsonify({'success': False, 'message': 'Todos os campos são obrigatórios.'}), 400

    if admin_key != ADMIN_KEY:
        return jsonify({'message': 'Chave de administrador inválida!'}), 403
    
    caminho_foto = None
    if foto:
        filename = secure_filename(foto.filename)
        caminho_foto = os.path.join(app.config['UPLOAD_FOLDER_USER'], filename)
        foto.save(caminho_foto)

    if ModelUserAdmin.query.filter_by(username=username).first():
        return jsonify({'message': 'Nome de usuário indisponivel!'}), 400
    
    if ModelUserAdmin.query.filter_by(email=email).first():
        return jsonify({'message': 'Email já cadastrado!'}), 400
    
    senha_hash = generate_password_hash(senha)
    novo_usuario = ModelUserAdmin(
        username=username,
        nome=nome,
        email=email,
        senha=senha_hash,
        foto=caminho_foto,
        is_admin=True
    )
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Administrador cadastrado com sucesso!'}), 201

#Cadastro de usuário
@app.route('/RegistroUser', methods=['POST'])
def registrar_users():
    username = request.form.get('username')
    nome = request.form.get('nome')
    email = request.form.get('email')
    senha = request.form.get('senha')
    foto = request.files.get('foto')

    caminho_foto = None
    if foto:
        filename = secure_filename(foto.filename)
        caminho_foto = os.path.join(app.config['UPLOAD_FOLDER_USER'], filename)
        foto.save(caminho_foto)

    if ModelUsers.query.filter_by(username=username).first():
        return jsonify({'message': 'Nome de usuário indisponivel!'}), 400
    
    if ModelUsers.query.filter_by(email=email).first():
        return jsonify({'message': 'Email já cadastrado!'}), 400
    
    senha_hash = generate_password_hash(senha)
    novo_usuario = ModelUsers(
        username=username,
        nome=nome,
        email=email,
        senha=senha_hash,
        foto=caminho_foto
    )
    db.session.add(novo_usuario)
    db.session.commit()

    carrinho = Carrinho(users_id = novo_usuario.id)
    db.session.add(carrinho)
    db.session.commit()

    return jsonify({'message': 'Usuário cadastrado com sucesso!'}), 201

#Login de usuário
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')

    user = ModelUsers.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'Usuário não encontrado!'}), 404

    if not user.verify_senha(senha):
        return jsonify({'message': 'Senha incorreta!'}), 401

    access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=1))

    
    return jsonify({
        'access_token': access_token,
        'usuario': user.to_dict()
    }), 200

#Atualizar Cadastro
@app.route('/AtualizarCadastro', methods=['PUT'])
@jwt_required()
def atualizarcad():
    user_id = get_jwt_identity()
    usuario = ModelUsers.query.get(user_id)

    if not usuario :
        return jsonify({"mensagem": "Usuario não encontrado"}), 404
    
    username = request.form.get("username")
    nome = request.form.get("nome")
    email = request.form.get("email")
    foto = request.files.get("foto")

    if username:
        usuario.username = username

    if nome:
        usuario.nome = nome

    if email:
        usuario.email = email

    if foto and allowed_file(foto.filename):
        filename = secure_filename(foto.filename)
        caminho_foto = os.path.join(app.config['UPLOAD_FOLDER_USER'], filename)
        foto.save(caminho_foto)
        usuario.foto = f"static/uploads/{filename}"

    db.session.commit()
    return jsonify({"mensagem": "Cadastro Atualiazdo com sucesso"}), 200


#Exibir Perfil
@app.route('/Perfil', methods=['GET'])
@jwt_required()
def perfil():
    user_id = get_jwt_identity()
    usuario = ModelUsers.query.get(user_id)

    if not usuario:
        return jsonify({"error": "Usuario não encontrado"}), 404
    
    return jsonify(usuario.to_dict()), 200

#Rota para verificar o token
@app.route('/verificarToken', methods=['GET'])
@jwt_required()
def verificar_token():
    current_user_id = int(get_jwt_identity())
    usuario = ModelUsers.query.get(current_user_id)

    if not usuario:
        return jsonify({'message': 'Usuário não encontrado!'}), 404

    return jsonify({
        'message': 'Token válido!',
        'usuario': usuario.to_dict()
    }), 200

@app.route('/listarUsers', methods=['GET'])
def listar_users():
    users = ModelUsers.query.all()
    output = [user.to_dict() for user in users]
    return jsonify(output) , 200

#CRIAR PRODUTO
@app.route('/createProduct', methods=['POST'])
def create_product():
    nome = request.form.get('nome')
    descricao = request.form.get('descricao')
    categoria = request.form.get('categoria')
    preco = request.form.get('preco')
    imagem = request.files.get('imagem')

    caminho_imagem = None
    if imagem:
        filename = secure_filename(imagem.filename)
        caminho_imagem = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        imagem.save(caminho_imagem)

    create_product = ModelProduct(
        nome=nome,
        descricao=descricao,
        categoria=categoria,
        preco=preco,
        imagem=caminho_imagem
    )
    db.session.add(create_product)
    db.session.commit()
    return jsonify({'message': 'Produto cadastrado com sucesso!'}), 201

#LISTAR PRODUTOS
@app.route('/getProducts', methods=['GET'])
def get_products():
    products = ModelProduct.query.all()
    output =[product.to_dict() for product in products]
    return jsonify(output), 200

#DELETAR PRODUTO
@app.route('/deleteProduct/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = ModelProduct.query.get(id)
    if product == None:
        return jsonify({'message': 'Produto não encontrado!'}), 404
    
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Produto deletado com sucesso!'}), 200

#ATUALIZAR PRODUTO
@app.route('/atualizarProduto/<int:id>', methods=['PUT'])
def atualizar_produto(id):
    produto = ModelProduct.query.get(id)
    if produto is None:
        return jsonify({'message': 'Produto não encontrado!'}), 404

    nome = request.form.get('nome')
    descricao = request.form.get('descricao')
    preco = request.form.get('preco')
    imagem = request.files.get('imagem')

    if nome:
        produto.nome = nome
    if descricao:
        produto.descricao = descricao
    if preco:
        produto.preco = preco
        try:
            produto.preco = float(preco)
        except ValueError:
            return jsonify({'message': 'Preço inválido!'}), 400
    if imagem:
        if produto.imagem:
            caminho_imagem_antigo = os.path.join(app.config['UPLOAD_FOLDER'], produto.imagem)
            if os.path.exists(caminho_imagem_antigo):
                os.remove(caminho_imagem_antigo)


        filename = secure_filename(imagem.filename)
        imagem_exit = os.path.splitext(filename)[1]
        filename_unico = f"{uuid.uuid4()}{imagem_exit}"
        caminho_imagem = os.path.join(app.config['UPLOAD_FOLDER'], filename_unico)
        imagem.save(caminho_imagem)

        produto.imagem = filename_unico

    db.session.commit()
    return jsonify({'message': 'Produto atualizado com sucesso!'}), 200

@app.route("/adicionarItens", methods=['POST'])
@jwt_required()
def adicionar_item():
    usuario_id = get_jwt_identity()

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

@app.route("/Carrinho", methods=['GET'])
@jwt_required()
def ver_carrinho():
    users_id = get_jwt_identity()
    carrinho = Carrinho.query.filter_by(users_id=users_id).first()

    itens = []
    for item in carrinho.itens:
        itens.append({
            'item_id': item.id,
            'products_id': item.products_id,
            'nome': item.products.nome,
            'preco': item.products.preco,
        })

    return jsonify(itens)

@app.route('/carrinho/item/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remover_item(item_id):
    users_id = get_jwt_identity()
    carrinho = Carrinho.query.filter_by(users_id=users_id).first()

    item = ItemCarrinho.query.filter_by(carrinho_id=carrinho.id, id=item_id).first()

    if not item:
        return jsonify({'message': 'Item não encontrado'}), 404

    db.session.delete(item)
    db.session.commit()

    return jsonify({'message': 'Item removido do carrinho'}), 200

@app.route('/limparCarrinho', methods=['DELETE'])
@jwt_required()
def limpar_carrinho():
    users_id = get_jwt_identity()
    carrinho = Carrinho.query.filter_by(users_id=users_id).first()

    ItemCarrinho.query.filter_by(carrinho_id=carrinho.id).delete()
    db.session.commit()

    return jsonify({'message': 'Carrinho limpo'}), 200

@app.route('/Buscar')
def buscar():
    q = request.args.get('q', '').strip()
    if not q:
        return jsonify({"resultados": []})
    
    results = ModelProduct.query.filter(ModelProduct.nome.ilike(f'%{q}%')).all()

    results_json = [{"item_id": i.id, "nome": i.nome, "categoria": i.categoria, "descricao": i.descricao, "imagem": i.imagem, "preco": i.preco } for i in results]

    return jsonify({"resultados": results_json})

@app.route("/Avaliacao", methods=['POST'])
@jwt_required()
def adicionar_comentario():
    try:
        user_id = get_jwt_identity()
        usuario = ModelUsers.query.get(user_id)
        comentario = request.form.get("comentario")

        new_coment = ModelComentarios(
            user_id=usuario.id,
            text=comentario
        )

        db.session.add(new_coment)
        db.session.commit()
        return jsonify({
            "Mensagem": "Comentario adicionado com sucesso"})

    except Exception as e:
            print("Erro ao salvar comentário:", e)
            return jsonify({"erro": "Erro interno ao processar o comentário"}), 500

@app.route("/Comentarios", methods=['GET'])
def Comentarios():
    comentarios = ModelComentarios.query.order_by(ModelComentarios.data.desc()).all()
    return jsonify([c.to_dict() for c in comentarios])

@app.route("/FinalizarCompra", methods=['POST'])
@jwt_required()
def finalizar_compra():
    user_id=get_jwt_identity()
    dados=request.get_json()
    itens=dados.get('itens')

    for item in itens:
        compra = ModelHistorico(
            user_id=user_id,
            produto_id=item.get('item_id') or item.get('id'),
            preco_unitario=item['preco']
        )
        db.session.add(compra)

    db.session.commit()
    return jsonify({"Mensagem": "Compra realizada com sucesso!"}), 200

@app.route("/Historico")
@jwt_required()
def get_historico():
    user_id=get_jwt_identity()

    historico = ModelHistorico.query.filter_by(user_id=user_id).order_by(ModelHistorico.data_compra.desc()).all()
    resultado = []
    for compra in historico:
        resultado.append({
            "id": compra.id,
            "produto_id": compra.produto_id,
            "produto_nome": compra.produtos.nome,
            "preco_unitario": compra.preco_unitario,
            "data_compra": compra.data_compra.strftime('%Y-%m-%d %H:%M:%S'),

        })
        return jsonify(resultado)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)