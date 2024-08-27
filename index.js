const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());



mongoose.connect('mongodb://localhost:27017/yourDB').then(() => console.log('Connected to MongoDB')).catch(err => console.log(err));


const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));