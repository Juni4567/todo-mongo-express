import test         from 'ava';
import MongoClient  from 'mongodb';

let db = null;

//this function will be placed in other folders and imported
function getConnection() {
    return new Promise((resolve, reject) => {
        // Check if the global db is already defined
        if(db) {
            return resolve(db);
        }

        // If global db is not defined, make a request to mongodb and save the db object in the globally defined db(var)
        MongoClient.connect('mongodb://localhost:27017/todo_app', (err, db_instance) => {
            if(err) {
                // Mostly it will be because the "mongod --dbpath c:/mongo-data" command has not run(mongo server is offline)
                return reject(err);
            }

            // If the db connection is successful then asign db_instance to our global db
            db = db_instance;
            // and resolve the promise with the db value
            resolve(db_instance);
        })
    })
}

//Before running every test, we need to share our database connection
//individually, so our code do not relay on Global variable

//{db} is shorthand in ES6 for {db: db}
test.beforeEach(t => {
   return new Promise((resolve, reject) => {
        getConnection().then(db => { 
            t.context = {db};
            resolve(db);
        }).catch(err => reject(err));
   })
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

        const deleteRecord1   = await t.context.db.collection('checklist').remove({_id: new MongoClient.ObjectID( task1._id.toString() )});
        t.is(await t.context.db.collection('checklist').count(), 1);

        const deleteRecord2   = await t.context.db.collection('checklist').remove({_id: new MongoClient.ObjectID( task2._id.toString() )});
        t.is(await t.context.db.collection('checklist').count(), 0);

        t.pass();

    }catch(e) {
        t.fail(e.toString());
    }

});