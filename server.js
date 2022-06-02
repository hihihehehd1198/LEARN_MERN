const express = require('express');
const connectDB = require('./config/db');
const app = express();
app.get('/',(req,res)=>{res.send('API RUNNING  ')});


connectDB();


//import middle ware to add content-type
app.use(express.json({extended:false}))

app.use('/api/users',require('./controller_api/users'));
app.use('/api/posts',require('./controller_api/posts'));
app.use('/api/auth',require('./controller_api/auth'));
app.use('/api/profile',require('./controller_api/profile'));

const PORT = process.env.PORT || 5000;

app.listen(PORT , () => console.log(`server started on port ${PORT}`));
