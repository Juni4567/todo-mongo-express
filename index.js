var express     = require('express');
var nunjucks    = require('nunjucks');
var bodyParser 	= require('body-parser');
var MongoClient = require('mongodb').MongoClient;

// mongodb://localhost:27017/todo_db (todo_db is the the db name and collection is a table inside that table)
MongoClient.connect('mongodb://localhost:27017/todo_db', function(err, db){
  if(err) throw err;

  db.collection('tasks').find().toArray(function (err, result){
    if(err) throw err

      // console.log(result);
  })
});


var app     	= express();


app.use(bodyParser.urlencoded({extended: true}));


nunjucks.configure('views', {
  autoescape: true,
  express: app
});


app.get('/', function (req, res) {
    // res.json({"status": 1, "reason" : "Hello there"});
    MongoClient.connect('mongodb://localhost:27017/todo_db', function(err, db){
      if(err) throw err;

      db.collection('tasks').find().toArray(function (err, result){
        if(err) throw err

          res.render('index.html', {
            title : 'Welcome to my TODO app',
            tasks : result
          })

      })
    });
  });

app.post('/create', function (req, res) {
    // res.json(req.body);
    MongoClient.connect('mongodb://localhost:27017/todo_db', function(err, db){
      if(err) throw err;
      console.log(req.body.task)


      var collection = db.collection('tasks');


      collection.insert({"taskName": req.body.task}, function(err, result){
        db.close();
      })

      collection.find().toArray(function (err, result){
        if(err) throw err

          res.render('create-todo.html', {
            title    : "Task submitted",
            taskName : req.body.task,
            tasks    : result,
          });
      })
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
