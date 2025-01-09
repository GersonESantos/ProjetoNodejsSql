// Importar módulo express
const express = require('express');

// Importar módulo fileUpload
const fileUpload = require('express-fileupload');

// Importar módulo express-handlebars
const { engine } = require('express-handlebars');

// Importar módulo mysql

const mysql = require('mysql2');
//File System
const fs = require('fs');

// App
const app = express();

// Adicionar fileUpload
app.use(fileupload());


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
// Rota principal contendo a situação
app.get('/:situacao', function(req, res){
    // res.render('formulario');
    //SQL
    let sql = 'SELECT * FROM produtos';
 conexao.query(sql, function(erro, retorno){
     if(erro) throw erro;
     res.render('formulario', {produtos: retorno , situacao: req.params.situacao});  
 })
 });
// Rota de cadastro
app.post('/cadastrar', function(req, res){
    try{
      // Obter os dados que serão utiliados para o cadastro
      let nome = req.body.nome;
      let valor = req.body.valor;
      let imagem = req.files.imagem.name;
 
      // Validar o nome do produto e o valor
      if(nome == '' || valor == '' || isNaN(valor)){
         res.redirect('/falhaCadastro');
      }else{
         // SQL
         let sql = `INSERT INTO produtos (nome, valor, imagem) VALUES ('${nome}', ${valor}, '${imagem}')`;
         
         // Executar comando SQL
         conexao.query(sql, function(erro, retorno){
             // Caso ocorra algum erro
             if(erro) throw erro;
 
             // Caso ocorra o cadastro
             req.files.imagem.mv(__dirname+'/imagens/'+req.files.imagem.name);
             console.log(retorno);
         });
 
         // Retornar para a rota principal
         res.redirect('/okCadastro');
      }
    }catch(erro){
     res.redirect('/falhaCadastro');
    }
 });

//retornar para a rota principal

// Rota de exclusão
// Rota para remover produtos
app.get('/remover/:codigo&:imagem', function(req, res){
    
    // Tratamento de exeção
    try{
        // SQL
        let sql = `DELETE FROM produtos WHERE codigo = ${req.params.codigo}`;

        // Executar o comando SQL
        conexao.query(sql, function(erro, retorno){
            // Caso falhe o comando SQL
            if(erro) throw erro;

            // Caso o comando SQL funcione
            fs.unlink(__dirname+'/imagens/'+req.params.imagem, (erro_imagem)=>{
                console.log('Falha ao remover a imagem ');
            });
        });

        // Redirecionamento
        res.redirect('/okRemover');
    }catch(erro){
        res.redirect('/falhaRemover');
    }
// Rota para redirecionar para  alteração/edição
app.get('/formularioEditar/:codigo', function(req, res){
   //SQL
    let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`;
   conexao.query(sql, function(erro, retorno){
       if(erro) throw erro;
       res.render('formularioEditar', {produto: retorno[0]});
   }); 
});

        
      // Rota para editar produtos
app.post('/editar', function(req, res){

    // Obter os dados do formulário
    let nome = req.body.nome;
    let valor = req.body.valor;
    let codigo = req.body.codigo;
    let nomeImagem = req.body.nomeImagem;

    // Validar nome do produto e valor
    if(nome == '' || valor == '' || isNaN(valor)){
        res.redirect('/falhaEdicao');
    }else {

        // Definir o tipo de edição
        try{
            // Objeto de imagem
            let imagem = req.files.imagem;

            // SQL
            let sql = `UPDATE produtos SET nome='${nome}', valor=${valor}, imagem='${imagem.name}' WHERE codigo=${codigo}`;
    
            // Executar comando SQL
            conexao.query(sql, function(erro, retorno){
                // Caso falhe o comando SQL
                if(erro) throw erro;

                // Remover imagem antiga
                fs.unlink(__dirname+'/imagens/'+nomeImagem, (erro_imagem)=>{
                    console.log('Falha ao remover a imagem.');
                });

                // Cadastrar nova imagem
                imagem.mv(__dirname+'/imagens/'+imagem.name);
            });
        }catch(erro){
            
            // SQL
            let sql = `UPDATE produtos SET nome='${nome}', valor=${valor} WHERE codigo=${codigo}`;
        
            // Executar comando SQL
            conexao.query(sql, function(erro, retorno){
                // Caso falhe o comando SQL
                if(erro) throw erro;
            });
        }

        // Redirecionamento
        res.redirect('/okEdicao');
    }
});
    
    
            
  




            //SQL



// Servidor
    
app.listen(8080);