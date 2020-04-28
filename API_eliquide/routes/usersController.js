var bcrypt = require('bcrypt');
var models    = require('../models');
var jwt = require('jsonwebtoken');

module.exports = {
    register: function(req, res) {
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;

        if (email == null || username == null || password == null) {
            return res.status(400).json({ 'error': '1missing parameters' })
        }
    },

    login: function(req, res) {
        var email    = req.body.email;
        var password = req.body.password;
    
        if (email == null ||  password == null) {
          return res.status(400).json({ 'error': '2missing parameters' });
        }

        models.User.findOne({
            attributes: ['email'],
            where:{ email: email }
        })
        .then(function(userfound) {
            if (!userFound) {
                bcrypt.hash(password, 5, function(err, bcryptedPassword ) {
                    var newUser = models.User.create({
                        email: email,
                        username: username,
                        password: bcryptedPassword,
                      })
                      .then(function(newUser) {
                        return res.status(201).json({
                            'userId': newUser.id
                        })
                      })
                      .catch(function(err) {
                        return res.status(500).json({ 'error': 'cannot add user' });
                      });
                });

            } else {
                return res.status(409).json({'error': 'user already exist' });
            }
        })
    },
}