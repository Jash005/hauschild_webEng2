import {echoDb} from "./databases.js";

interface Echo {
    _id: string;
    message: string;
    createdAt: string;
    updatedAt: string;
}

export function createEcho(message: string): Promise<Echo> {
    const currentTimestamp = new Date().toISOString();
    const doc: Omit<Echo, '_id'> = {
        message: message,
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp
    };

    return echoDb.insertAsync(doc);
}

export function getEcho(id: string): Promise<Echo> {
    return echoDb.findOneAsync({_id: id});
}

export function queryEchos(containsString?: string): Promise<Echo[]> {
    return echoDb.findAsync(containsString ? {message: new RegExp(containsString)} : {});
}

export async function updateEcho(id: string, message: string): Promise<Echo> {
    const currentTimestamp = new Date().toISOString();

    await echoDb.updateAsync({_id: id}, {$set: {message, updatedAt: currentTimestamp}});
    return getEcho(id);
}

export async function deleteEcho(id: string): Promise<void> {
    await echoDb.removeAsync({_id: id}, {});
}
