var express 	= require('express');
var nunjucks    = require('nunjucks');
var bodyParser 	= require('body-parser');
var app     	= express();


app.use(bodyParser.urlencoded({extended: true}));


nunjucks.configure('views', {
    autoescape: true,
    express: app
});


app.get('/', function (req, res) {
    // res.json({"status": 1, "reason" : "Hello there"});
    res.render('index.html', {
    	title : 'Welcome to my TODO app',
    })
});

app.post('/create', function (req, res) {
    console.log(req.body);
    // res.json(req.body);
    res.render('create-todo.html', {
        title           : req.body.name,
        quoteContent    : req.body.quote
    });
    // res.send('create-todo.html');
});




// app.post('/update/:id', function (req, res) {
//     res.json({"status": 1, "reason" : "Now updating " + req.params.id});
// });

// app.post('/delete/:id', function (req, res) {
//     res.json({"status": 1, "reason" : "Now deleting " + req.params.id});
// });

// app.get('/test/:id', function (req, res) {
//     res.json({"status": 1, "reason" : "Now Testing " + req.params.id});
// });

app.listen((process.env.PORT || 3003), function () {
    console.log('Here you go, Open localhost:3003 and see you app running');
})