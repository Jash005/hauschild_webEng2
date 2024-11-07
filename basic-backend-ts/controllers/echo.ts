import express from 'express';
import {createEcho, deleteEcho, getEcho, queryEchos, updateEcho} from "../models/echo.js";
import {Request, Response, NextFunction} from "express";

const router = express.Router();

function validateEcho(req: Request, res: Response, next: NextFunction) {
    if (req.body.message) {
        next();
    } else {
        res.status(400);
        res.json({message: 'message is missing'});
    }
}

router.post('/', validateEcho, async (req, res) => {
    const message = req.body.message;

    const echo = await createEcho(message);
    res.status(201).json(echo);
});

router.get('/', async (req, res) => {
    const containsString = req.query.contains as string | undefined;

    const echos = await queryEchos(containsString);
    res.json(echos);
});

router.put('/:echoId', validateEcho, async (req, res) => {
    const message = req.body.message;
    const id = req.params['echoId'];

    if (!await getEcho(id)) {
        return res.status(404).json({message: 'Echo not found'});
    }

    const updatedEcho = await updateEcho(id, message);

    res.json(updatedEcho);
});

router.delete('/:echoId', async (req, res) => {
    const id = req.params['echoId'];

    if (!await getEcho(id)) {
        return res.status(404).json({message: 'Echo not found'});
    }

    await deleteEcho(id);
    res.status(204).send();
});

export { router as echoController };
