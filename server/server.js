const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors())

app.get('/hello', (req, res) => res.send('hello'))

const Port = process.env.PORT || 5000;


app.listen(Port, () => console.log('Server is running...'))
