import {echoDb} from './databases.js';

export function createEcho(message) {
    const currentTimestamp = new Date().toISOString();
    const doc = {
        message: message,
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp
    };

    return echoDb.insertAsync(doc);
}

export function getEcho(id) {
    return echoDb.findOneAsync({_id: id});
}

export function queryEchos(containsString) {
    return echoDb.findAsync(containsString ? {message: new RegExp(containsString)} : {});
}

export function updateEcho(id, message) {
    const currentTimestamp = new Date().toISOString();

    return echoDb.updateAsync({_id: id}, {$set: {message, updatedAt: currentTimestamp}});
}

export function deleteEcho(id) {
    return echoDb.removeAsync({_id: id}, {});
}
