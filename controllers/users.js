import { Router }       from 'express';
import { ObjectID }     from 'mongodb';

const router = new Router();

router.get('/', (req, res, next) => {
    res.send('Users index page');
});

router.get('/create', (req, res, next) => {
    res.send('Users create page');
});

router.get('/update/:id', (req, res, next) => {
    res.send('Users update page');
});

router.get('/delete/:id', (req, res, next) => {
    res.send('Users delete page');
});

export default router;