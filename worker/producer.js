import { createClient } from "redis";

let client = null;
let isConnecting = false;

const initClient = async () => {
    if (client && client.isOpen) {
        return client;
    }
    
    if (isConnecting) {
        return null;
    }
    
    isConnecting = true;
    try {
        client = createClient({ 
            url: process.env.REDIS_URL || "redis://localhost:6379",
            socket: {
                connectTimeout: 1000,
            }
        });
        
        client.connect().catch(() => {
        });
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (client.isOpen) {
            return client;
        }
    } catch (error) {
    } finally {
        isConnecting = false;
    }
    
    return null;
};

const publishEvent = (channel, payload) => {
    setImmediate(async () => {
        try {
            const redisClient = await initClient();
            if (redisClient && redisClient.isOpen) {
                await redisClient.publish(channel, JSON.stringify(payload));
            }
        } catch (error) {
        }
    });
};

export default publishEvent;