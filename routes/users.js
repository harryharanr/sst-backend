const auth = require('../middleware/auth');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Get all details of users
router.get('/', async (req,res) => {
  let users = await User.find().select('_id name shift');
  res.send(users);
});

// Get shift details of an employee
router.get('/:id', async (req,res) => {
  let user = await User.findById(req.params.id);
  if(!user) return res.status(400).send('ID not provided.');
  res.send(user.shift);
});

// Register an employee
router.post('/', async (req, res) => {
    const { error } = validate(req.body);   
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email })
    if(user) return res.status(400).send('User already registered.');

    user = new User(_.pick(req.body,['name','email','password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    res.send(_.pick(user,['_id','name','email']));
});

// Post shift details of an employee
router.put('/', async (req, res) => {
  const newShift = {
    date: req.body.date,
    shift: req.body.shift
  };
  if(!req.body.userId) return res.status(400).send('user id not provided!');

  let user = await User.findOne({ _id: req.body.userId })
  if(!user) return res.status(400).send('User Id not valid!');
  user.shift.push(newShift);
  user.save();
  res.send(user);
});

module.exports = router;
