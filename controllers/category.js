import { Router }       from 'express';
import { ObjectID }     from 'mongodb';

const router = new Router();

router.get('/', (req, res, next) => {
    res.send('Category index page');
});

router.get('/create', (req, res, next) => {
    res.send('Category create page');
});

router.get('/update/:id', (req, res, next) => {
    res.send('Category update page');
});

router.get('/delete/:id', (req, res, next) => {
    res.send('Category delete page');
});

export default router;