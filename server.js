// Load modules

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

// Retrieve data from a POST

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set port and routes
var port = process.env.PORT || 8080;
var router = express.Router();

// Respond to basic request
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// Define routes
app.use('/api', router);

// Start it up!
app.listen(port);
console.log('I\'ve been started up on port ' + port);
