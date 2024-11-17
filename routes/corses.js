import cors from "cors";

const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://127.0.0.1:5501',
  'https://admin-blackie-y3kg.vercel.app',
  'http://localhost:5173',
  'http://blackienetworks.com',
  'https://blackie-softwareadmin-enockays-projects.vercel.app',
  'http://127.0.0.1:5500'
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
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allow all necessary methods
    optionsSuccessStatus: 204, // For successful OPTIONS requests
  };
};

export default corsOptions;

