// Importar módulo express
const express = require('express');

const mysql = require('mysql2');

// App
const app = express();

const conexao = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: 'Gabibi89*',
    database: 'projeto'
    });


conexao.connect(function(err){
    if(err) return console.log(err);
    console.log('Conectou!');
    createTable(conexao);
})



// Rota de teste
app.get('/', function(req, res){
    res.end('Hello World!');
});

// Servidor
app.listen(8080);