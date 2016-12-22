import express              from 'express';
import nunjucks             from 'nunjucks';
import bodyParser           from 'body-parser';
import mongodb              from 'mongodb'

//Routes / Controllers
import indexRoutes          from './controllers/main';
import categoryRoutes       from './controllers/category';
import userRoutes           from './controllers/users';

// Import the variables defined in our config.js file
import {PORT, DB_URL}       from './config';

const MongoClient = mongodb.MongoClient;
const app         = express();


//Basic Configurations & Database Connections
app.use(bodyParser.urlencoded({extended: true}));
app.use('/category', categoryRoutes);
app.use('/user', userRoutes);
app.use('/', indexRoutes);

// Add ability to express for static Assets' Path
// so now when we add /css/styles.css it will load the styles in css directory within assets folder in root
app.use(express.static('assets'))

nunjucks.configure('views', {
    autoescape: true,
    express   : app
});

// I was doing this because I wanted to have a global path avaialable so i can add my custom css/js and images :D
// Found a solution within expressjs : http://prnt.sc/dmp0l4
// app.use(function (req, res, next) {
//     app.locals.hostUrl  = req.headers.host;
//     next();
// })

//Connection Handling
async function startAPP() {

    try {

        //@IMPORTANT, it will ensure we have db object available throughout.
        app.locals.db       = await MongoClient.connect(DB_URL);

        app.listen(PORT, () => {
            console.log(`Here you go, Open localhost:${PORT} and see you app running`);
        });

    }catch(err) {
        console.warn(`Failed to connect to the database. ${err.stack}`);
    }

}



//Ok, Launch application now!
startAPP();