const startupDebugger = require('debug')('app:startup'); //use DEBUG enviroment varible, set to this namespace to show these logs only
const dbDebugger = require('debug')('app:db'); //use DEBUG enviroment varible, set to this namespace to show these logs only
//can also use multiple namespaces like DEBUG=app:startup,app:db or wildcard like DEBUG=app:*

const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi');
const logger = require('./logger');
const express = require('express');

var app = express();

console.log(`NODE_ENV is: ${process.env.NODE_ENV}`); //option 1
console.log(`ap.get:${app.get('env')}`);            //option 2
//app.get('env'); // it uses process.env.NODE_ENV but if its not set, use development by default.

//Use this middleware <-use express json middleware
console.log(express.json()); 
app.use(express.json());    //parse the body and if its json, parse it into json object
app.use(express.urlencoded({ extended: true})); //parses the request with url encoded payload and populate req.body with the  key value pair
app.use(express.static('public')); //use this folder for static files;
app.use(helmet());

app.set('view engine', 'pug'); //set view and engine properties to pug, which node will load and assign
app.set('views', './views'); //optional, to set the views path for template 

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));    //Logs http request in short form// better to enable only in dev. or enable if config.
    //console.log('Morgan Enabled');
    startupDebugger("Morgan Enabled");
}


//TODO: Some DB work
dbDebugger("DB Connected..");


//Configuration
console.log('Application Name:' + config.get('name'));
console.log('Mail Server:' + config.get('mail.host'));
console.log('Mail Password:' + config.get('mail.password'));
//confi.get looks into multiple sources, config file, environment vaiable or command line arg. Check documentation

app.use(logger);

const courses = [
    { id:1, 'title':'English'},
    { id:2, 'title':'Physics'},
    { id:3, 'title':'Chemistry'}
]
app.get('/', (req, res) => {
    //res.send({"wow": "hello world"})
    res.render('index', {title:"my Express App", message:"Hello..."});
});

app.get('/api/courses', (req, res) => {
    res.send(courses)
});

app.get('/api/courses/:year/:month', (req, res) => {
    
    res.send([
        req.params, //all URL params
        req.query   //all query params
    ])
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) return res.status(404).send('Course not found');
    res.send(course);
});

app.post('/api/courses', (req, res) => {
    const { error } = validate(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return 
    }
    const course = {
        id: courses.length + 1,
        title: req.body.title
    }
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) return res.status(404).send('Course not found');

    const result = validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return 
    }

    course.title = req.body.title; 
    
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) return res.status(404).send('Course not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(courses);
});

const NODE_PORT = process.env.NODE_PORT || 3000;
app.listen(NODE_PORT, () => console.log(`listening on port ${NODE_PORT}`));


function validate(course) {
    const schema = {
        title: Joi.string().min(3).required()
    }

    const result = Joi.validate(course, schema);

    return result;
}