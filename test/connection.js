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


//Find the Task number 1, delete and then ensure we have only one result
test('Delete Collection', async t => {

    t.is(await t.context.db.collection('checklist').count(), 2);

    const task1          = await t.context.db.collection('checklist').findOne({'title' : "Task 1"});
    const deleteRecord   = t.context.db.collection('checklist').deleteOne({_id: new MongoClient.ObjectID(task1._id)});

    return deleteRecord.then(async (result) => {
        t.not(result, null);
        t.is(await t.context.db.collection('checklist').count(), 1);

        t.pass();
    });
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