//Libraries
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

//server configuration
var port = 6200;

// Connection to DB
mongoose.connect('mongodb://mongodb')
    .then(() => {
      console.log('Backend Started');
    })
    .catch(err => {
        console.error('Backend error:', err.stack);
        process.exit(1);
    });




// App Instance
var app = express();

const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const tagsRouter = require('./routes/tags');
const reviewsRouter = require('./routes/reviews');
const loginRouter = require('./routes/login');
const pictureRouter = require('./routes/pictures');
const requestsRouter = require('./routes/requests');


app.use(express());

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api/users', usersRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/login', loginRouter);
app.use('/api/picture', pictureRouter);
app.use('/api/requests', requestsRouter);
// Execute App
app.listen(port, () => {
  console.log('TodoList Backend running on Port: ',port);
});
