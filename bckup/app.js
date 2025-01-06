// Importar módulo express
const express = require('express');

// Importar módulo fileupload
const fileUpload = require('express-fileupload');

// Importar módulo express-handlebars
const { engine } = require('express-handlebars');

// Importar módulo mysql

const mysql = require('mysql2');
//File System
const fs = require('fs');

// App
const app = express();

// Adicionar fileupload
app.use(fileUpload());


//adicionar Bootstrap

app.use('/Bootstrap', express.static('./node_modules/bootstrap/dist'));

//adicionar css

app.use('/css', express.static('./css'));

//referenciar imagens
app.use('/imagens', express.static('./imagens'));

// Configuração do Handlebars


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');   
app.set('views', './views');

//Manipulação de dados  

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const conexao = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: 'Gabibi89*',
    database: 'projeto'
    });


conexao.connect(function(erro){
    if(erro) throw erro;
    console.log('Conectou!');
    //createTable(conexao);
})

// Rota principal
app.get('/', function(req, res){
   // res.render('formulario');
   //SQL
   let sql = 'SELECT * FROM produtos';
conexao.query(sql, function(erro, retorno){
    if(erro) throw erro;
    res.render('formulario', {produtos: retorno});  
})
});
// Rota de cadastro

app.post('/cadastrar', function(req, res){
    //obter dados para o cadastro
let nome = req.body.nome;
let valor = req.body.valor;
let imagem = req.files.imagem.name;
//req.files.imagem.mv(__dirname+'/imagens/'+ req.files.imagem.name);
//   SQL
	
let sql = `INSERT INTO produtos (nome, valor, imagem) VALUES ('${nome}', ${valor}, '${imagem}')`;


conexao.query(sql, function(erro, resultado){
    if(erro) throw erro;
    req.files.imagem.mv(__dirname+'/imagens/'+ req.files.imagem.name);

    console.log('Cadastrado com sucesso!'+resultado);
    
})
//retornar para a rota principal
res.redirect('/');

}); 
// Rota de exclusão
app.get('/remover/:codigo&:imagem', function(req, res){
    let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`;
    conexao.query(sql, function(erro, retorno){
        if(erro) throw erro;
        
         fs.unlink(__dirname+'/imagens/'+req.params.imagem, (erro_imagem)=>{  
        
            console.log('falha ao excluir imagem');
        });
    });
    res.redirect('/');
    
});
// Rota para redirecionar para  alteração/edição
app.get('/formularioEditar/:codigo', function(req, res){
   //SQL
    let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`;
   conexao.query(sql, function(erro, retorno){
       if(erro) throw erro;
       res.render('formularioEditar', {produto: retorno[0]});
   }); 
});
// Rota de edição
app.post('/editar', function(req, res){
         //obter dados para a edição
         let nome = req.body.nome;
         let valor = req.body.valor;
         let codigo = req.body.codigo;
            let nomeImagem = req.body.nomeImagem;
            let imagem = req.files.imagem.name;
            console.log(nome);
            console.log(valor);
            console.log(codigo);
            console.log(nomeImagem);
            console.log(imagem);
            //finalizar a edição
            res.end();
});
            
            
            //SQL



// Servidor
    
app.listen(8080);