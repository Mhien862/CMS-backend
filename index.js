import { startServer } from './startSever.js';

   process.on('uncaughtException', (error) => {
     console.error('Uncaught Exception:', error);
     console.error(error.stack);
     process.exit(1);
   });

   process.on('unhandledRejection', (reason, promise) => {
     console.error('Unhandled Rejection at:', promise, 'reason:', reason);
     process.exit(1);
   });

   try {
     await startServer();
   } catch (error) {
     console.error('Failed to start server:', error);
     console.error(error.stack);
     process.exit(1);
   }