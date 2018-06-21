const {Shift, validate} = require('../models/shift'); 
const {User} = require('../models/user');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const date = new Date(req.body.date);
    
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(400).send('Invalid user.');

    const shift = new Shift({
        user: user,
        date: date,
        shift: req.body.shift
    });
    await shift.save();
    
    res.send(shift);
});

router.get('/:id', async (req, res) => {
    if(!req.params.id) return res.status(400).send('No ID provided');

    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send('Invalid user.');

    const shifts = await Shift
                    .find({ user: user })
                    .sort({ date: 1})
                    .select({ date: 1 , shift: 1});
    res.send(shifts);
});

module.exports = router;