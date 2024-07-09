const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 3000;

const baseRouter = require('./src/routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(baseRouter);

try {
    mongoose.connect("mongodb://localhost:27017/taskTrackingDB");
} catch (err) {
    console.error("Failed while connecting to mongodb");
}

app.listen(PORT, (err) => {
    if (err) {
        return console.error('Something went wrong', err);
    }
    console.log(`Server listening on ${PORT}`);
})

module.exports = app;