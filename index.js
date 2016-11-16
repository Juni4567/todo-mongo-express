var express 	= require('express');
var nunjucks 	= require('nunjucks');
var app     	= express();



nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// app.get('/', function(req, res) {
//     res.render('index.html');
// });


app.get('/', function (req, res) {
    // res.json({"status": 1, "reason" : "Hello there"});
    res.render('index.html', {

    	title : 'My First Nunjucks Page',
	    items : [
	      { name : 'item #1' },
	      { name : 'item #2' },
	      { name : 'item #3' },
	      { name : 'item #4' },
	    ],

	    divideTitle: function(){
	    	var titleArr = this.title.split(" ");
	    	alert(titleArr);
	    }

    })
});

app.post('/create', function (req, res) {
    res.json({"status": 1, "reason" : "Hello there"});
    // res.send('create-todo.html');
});

app.post('/update/:id', function (req, res) {
    res.json({"status": 1, "reason" : "Now updating " + req.params.id});
});

app.post('/delete/:id', function (req, res) {
    res.json({"status": 1, "reason" : "Now deleting " + req.params.id});
});

app.get('/test/:id', function (req, res) {
    res.json({"status": 1, "reason" : "Now Testing " + req.params.id});
});

app.listen((process.env.PORT || 3000), function () {
    console.log('Here you go, Open localhost:3000 and see you app running');
})