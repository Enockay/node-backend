
import cors from "cors";

const allowedOrigins = [
  'http://127.0.0.1:5500',
   'http://127.0.0.1:5501',
  'https://admin-blackie-y3kg.vercel.app',
  'http://localhost:5173',
  'http://blackienetworks.com',
  'https://blackie-softwareadmin-enockays-projects.vercel.app'
];

const corsOptions = () => {
  return {
    origin: (origin, callback) => {
      // Allow requests with no origin like mobile apps or curl requests
      if (!origin) return callback(null, true);

      // Allow requests from the specified origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Reject requests from other origins
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['POST'], // You can add other methods if necessary
    optionsSuccessStatus: 204,
  };
};


export default corsOptions;
