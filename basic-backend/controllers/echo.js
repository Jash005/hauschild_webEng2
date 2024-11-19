import express from 'express';
import {createEcho, deleteEcho, getEcho, queryEchos, updateEcho} from '../models/echo.js';

const router = express.Router();

function validateEcho(req, res, next) {
    if (req.body.message) {
        next();
    } else {
        res.status(400);
        res.json({message: 'Request Inhalt fehlt'});
    }
}

router.post('/', validateEcho, async (req, res) => {
    const message = req.body.message;

    const echo = await createEcho(message);
    res.status(201).json(echo);
});

router.get('/', async (req, res) => {
    const containsString = req.query.contains;

    const echos = await queryEchos(containsString);
    res.json(echos);
});

router.put('/:echoId', validateEcho, async (req, res) => {
    const message = req.body.message;
    const id = req.params['echoId'];

    if (!await getEcho(id)) {
        return res.status(404).json({message: 'Echo nicht gefunden'});
    }

    await updateEcho(id, message);
    const updatedEcho = await getEcho(id);

    res.json(updatedEcho);
});

router.delete('/:echoId', async (req, res) => {
    const id = req.params['echoId'];

    if (!await getEcho(id)) {
        return res.status(404).json({message: 'Echo nicht gefunden'});
    }

    await deleteEcho(id);
    res.status(204).send();
});

export { router as echoController };
