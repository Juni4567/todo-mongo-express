import express              from 'express';
import nunjucks             from 'nunjucks';
import bodyParser           from 'body-parser';
import mongodb              from 'mongodb'

//Routes / Controllers
import indexRoutes          from './controllers/main';
import categoryRoutes       from './controllers/category';
import userRoutes           from './controllers/users';

import {PORT, DB_URL}       from './config';

const MongoClient = mongodb.MongoClient;
const app         = express();

//Basic Configurations & Database Connections
app.use(bodyParser.urlencoded({extended: true}));

app.use('/category', categoryRoutes);
app.use('/user', userRoutes);
app.use('/', indexRoutes);


nunjucks.configure('views', {
    autoescape: true,
    express   : app
});

//Connection Handling
async function startAPP() {

    try {

        //@IMPORTANT, it will ensure we have db object available throughout.
        app.locals.db = await MongoClient.connect(DB_URL);

        app.listen(PORT, () => {
            console.log(`Here you go, Open localhost:${PORT} and see you app running`);
        });

    }catch(err) {
        console.warn(`Failed to connect to the database. ${err.stack}`);
    }

}

//Ok, Launch application now!
startAPP();