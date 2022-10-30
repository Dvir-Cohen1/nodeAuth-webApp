
import { app } from './app.js';
import database from './config/connectToDatabase.js'; // for database connection

database()

const PORT = process.env.PORT;
app.listen(PORT, console.log(`Server Running on port ${PORT}`));
