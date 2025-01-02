// Importar módulo express
const express = require('express');

// Importar módulo fileupload
const fileUpload = require('express-fileupload');

// Importar módulo express-handlebars
const { engine } = require('express-handlebars');

// Importar módulo mysql

const mysql = require('mysql2');
// App
const app = express();

// Adicionar fileupload
app.use(fileUpload());


//adicionar Bootstrap

app.use('/Bootstrap', express.static('./node_modules/bootstrap/dist'));

//adicionar css

app.use('/css', express.static('./css'));

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
    res.render('formulario');
});

// Rota de cadastro

app.post('/cadastrar', function(req, res){
console.log(req.body);
console.log(req.files.imagem.name);
req.files.imagem.mv(__dirname+'/imagens/'+ req.files.imagem.name);
res.end();
});

// Servidor
app.listen(8080);