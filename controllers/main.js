import { Router }       from 'express';
import { ObjectID }     from 'mongodb';

const router            = new Router();
let   visitorCounter    = 0;

router.get('/', async (req, res, next) => {

    try {

        visitorCounter++;

        const db    = req.app.locals.db;

        //Ensure we have only fields which do not have archive attribute
        const tasks = await db.collection('tasks').find({
            archive: { $exists: false }
        }).toArray();

        tasks.reverse();
        //Testing Heavy DB Operations
        //await db.collection('visitors').insertOne({visitorCounter});

        const title = "Welcome to my TODO app";

        res.render('index.html', {title, tasks, visitorCounter});

    } catch (err) {
        next(err);
    }

});

router.post('/create', async (req, res, next) => {

    try {

        const db       = req.app.locals.db;
        const taskName = req.body.task;

        if(taskName.length){
            console.log("Submitting task to db: "+ taskName);
            const task     = await db.collection('tasks').insertOne({taskName});
            //Task has been submitted, lets redirect user back to main screen
            res.redirect(`/?action=task-inserted&id=${task.insertedId}`);
        }
        else{
            console.log("Submittion abandoned because of empty task: "+ taskName);
            res.redirect(`/?action=task-insertion-abandoned}`);
        }


    } catch (err) {
        next(err);
    }

});


router.get('/delete/:id', async (req, res, next) => {

    try {

        const db           = req.app.locals.db;
        const _id          = new ObjectID(req.params.id);
        const deleteRecord = await db.collection('tasks').deleteOne({_id});

        //Task has been submitted, lets redirect user back to main screen
        res.redirect(`/?action=task-deleted&id=${req.params.id}`);

    } catch (err) {
        next(err);
    }

});

router.get('/archive', async (req, res, next) => {

    try {

        const db    = req.app.locals.db;

        //Ensure we have only fields which do not have archive attribute
        const tasks = await db.collection('tasks').find({
            archive: 1
        }).toArray();

        const title = "Archived Tasks";

        res.render('index.html', {title, tasks});

    } catch (err) {
        next(err);
    }

});


router.get('/archive/:id', async (req, res, next) => {

    try {

        const db            = req.app.locals.db;
        const _id           = new ObjectID(req.params.id);
        const updatedRecord = await db.collection('tasks').updateOne({ _id }, { $set:{
            "archive" : 1
         }})

        //Task has been submitted, lets redirect user back to main screen
        res.redirect(`/?action=task-archived&id=${req.params.id}`);

    } catch (err) {
        next(err);
    }

});

export default router;