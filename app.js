import express from "express"
import cors from 'cors'
import helmet from "helmet";
import morgan from "morgan";
//importing from folders
import {sequelize} from "./config/dbConfig.js"
 import userRoutes from './routes/userRoute.js'
 import uploadRoutes from './routes/uploadRoute.js'
 import authRoutes from './routes/authRoute.js'
 import productRoutes from './routes/productRoute.js'


const app = express()
const PORT = 4000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Routes
app.use('/api', uploadRoutes);
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', productRoutes);

//error handling middlewares
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });

//database connections and port connection
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Connected to SQLite database');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to the database:', err.message);
  });