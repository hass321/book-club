import fp from 'fastify-plugin';
import cors from '@fastify/cors';

export default fp(async (fastify) => {
  fastify.register(cors, {
    origin: true, // Allow all origins or set to your frontend URL for production
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Referrer-Policy'],
  });
});
