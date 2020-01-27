const express = require('express');
const router = express.Router(); //instead of app object we use Router object. Since index uses app

const courses = [
    { id:1, 'title':'English'},
    { id:2, 'title':'Physics'},
    { id:3, 'title':'Chemistry'}
]

router.get('/', (req, res) => {
    res.send(courses)
});

router.get('/:year/:month', (req, res) => {
    
    res.send([
        req.params, //all URL params
        req.query   //all query params
    ])
});

router.get('/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) return res.status(404).send('Course not found');
    res.send(course);
});

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) return res.status(404).send('Course not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(courses);
});



function validate(course) {
    const schema = {
        title: Joi.string().min(3).required()
    }

    const result = Joi.validate(course, schema);

    return result;
}

module.exports = router;