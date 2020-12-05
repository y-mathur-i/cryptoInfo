const express = require('express');
const bodyParser = require('body-parser');
const coinRoutes = require('./Routes/coinRoutes')
const app = express();

// middleware
app.use(bodyParser.json())
app.use('/coins',coinRoutes);


app.get('/',(req,res)=>{
    res.send('Welcome to cryptoApi, written by yogesh mathur.')
})

PORT = process.env.PORT || 5000
app.listen(PORT ,()=>{
    console.log(`Listening on port ${PORT}`)
})