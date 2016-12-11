import test         from 'ava';
import MongoClient  from 'mongodb';

let db = null;

//this function will be placed in other folders and imported
function getConnection() {
    return new Promise((resolve, reject) => {
        if(db) {
            return resolve(db);
        }

        MongoClient.connect('mongodb://localhost:27017/todo_app', (err, db_instance) => {
            if(err) {
                return reject(err);
            }

            db = db_instance;
            resolve(db_instance);
        })
    })
}

//Before running every test, we need to share our database connection
//individually, so our code do not relay on Global variable

//{db} is shorthand in ES6 for {db: db}
test.beforeEach(t => {
   return new Promise((resolve, reject) => {
       getConnection().then(db => { t.context = {db}; resolve(db); }).catch(err => reject(err));
   })
});

test('Test Database Connection', t => {
    t.is(typeof t.context, 'object');
    t.is(typeof t.context.db, 'object');

    t.pass();
});

test('Insert Multiple Items', async t => {
    //Ensure that our checklist is empty
    t.context.db.collection('checklist').remove();

    let title = "Task 1";
    t.context.db.collection('checklist').insert({title});

    title = "Task 2";
    t.context.db.collection('checklist').insert({title});

    t.is(await t.context.db.collection('checklist').find({}).count(), 2);

    t.pass();
});

test('Find Collection', async t => {
    t.is(await t.context.db.collection('checklist').find({title : "Task 1"}).count(), 1);
    t.is(await t.context.db.collection('checklist').find({title : "Task 3"}).count(), 0, "Wrong value is coming during search");

    t.pass();
});


test('Find the Task number 1, delete and then ensure we have only one result', async t => {

    try {

        t.is(await t.context.db.collection('checklist').count(), 2);

        const task1          = await t.context.db.collection('checklist').findOne({'title' : "Task 1"});
        const deleteRecord   = await t.context.db.collection('checklist').deleteOne({_id: new MongoClient.ObjectID(task1._id)});

        t.is(await t.context.db.collection('checklist').count(), 1);
        t.pass();

    }catch(e) {
        t.fail(e.toString());
    }

});


test('Delete Multiple items & then remove collection', async t => {

    try {

        //Cleanup collection and insert two items
        t.context.db.collection('checklist').remove();

        let title = "Task 1";
        t.context.db.collection('checklist').insert({title});

        title = "Task 2";
        t.context.db.collection('checklist').insert({title});

        //Lets start calculation again
        t.is(await t.context.db.collection('checklist').count(), 2);

        const task1          = await t.context.db.collection('checklist').findOne({'title' : "Task 1"});
        const task2          = await t.context.db.collection('checklist').findOne({'title' : "Task 2"});

        t.not(task1, null);
        t.not(task2, null);

        const deleteRecord   = await t.context.db.collection('checklist').remove({_id: {
            "$in" : [new MongoClient.ObjectID(task1._id), new MongoClient.ObjectID(task2._id)]
        }});

        t.is(await t.context.db.collection('checklist').count(), 0);
        t.pass();
    }catch(e) {
        t.fail(e.toString());
    }
    });

test('Juni\'s first test', async t=> {
    let a = 2;
    let b = 1;
    let c = a+b;
    if(c === 3){
        t.pass();
    }else{
        t.fail();
    }
});