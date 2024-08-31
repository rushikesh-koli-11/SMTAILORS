const express = require('express');
const mongoose = require('mongoose');
const app = express();
const indexRoutes = require('./routes/index');

mongoose.connect('mongodb+srv://rushiikoli:rushii%4012345@cluster0.dz6sb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas', err));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
