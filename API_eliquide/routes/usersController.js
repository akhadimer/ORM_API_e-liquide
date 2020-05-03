var bcrypt = require('bcrypt');
var models = require('../models');
var jwtUtils = require('../utils/jwt.utils');
var asyncLib  = require('async');

module.exports = {
    register: function (req, res) {
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;

        if (email == null || username == null || password == null) {
            return res.status(400).json({ 'error': '1missing parameters' });
        }

        models.User.findOne({
            attributes: ['email'],
            where: { email: email }
        })
            .then(function (userFound) {
                if (!userFound) {
                    bcrypt.hash(password, 5, function (err, bcryptedPassword) {
                        var newUser = models.User.create({
                            email: email,
                            username: username,
                            password: bcryptedPassword,
                        })
                            .then(function (newUser) {
                                return res.status(201).json({
                                    'userId': newUser.id
                                })
                            })
                            .catch(function (err) {
                                return res.status(500).json({ 'error': 'cannot add user' });
                            });
                    });

                } else {
                    return res.status(409).json({ 'error': 'user already exist' });
                }
            })
    },

    login: function (req, res) {
        var email = req.body.email;
        var password = req.body.password;

        if (email == null || password == null) {
            return res.status(400).json({ 'error': '2missing parameters' });
        }

        models.User.findOne({
            where: { email: email }
        })
            .then(function (userFound) {
                if (userFound) {
                    bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
                        if (resBycrypt) {
                            return res.status(200).json({
                                'userId': userFound.id,
                                'token': jwtUtils.generateTokenForUser(userFound)
                            })
                        } else {
                            return res.status(403).json({ "error": "invalid password" });
                        }
                    });

                } else {
                    return res.status(404).json({ 'error': 'user not exist in DB' });
                }
            })
            .catch(function (err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
            });
    },

    getUserProfile: function (req, res) {
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        if (userId < 0)
            return res.status(400).json({ 'error': 'wrong token' });

        models.User.findOne({
            attributes: ['id', 'email', 'username'],
            where: { id: userId }
        }).then(function (user) {
            if (user) {
                res.status(201).json(user);
            } else {
                res.status(404).json({ 'error': 'user not found' });
            }
        }).catch(function (err) {
            res.status(500).json({ 'error': 'cannot fetch user' });
        });
    },
    updateUserProfile: function (req, res) {
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        var username = req.body.username;
        var email = req.body.email;

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    attributes: ['id', 'username', 'email'],
                    where: { id: userId }
                }).then(function (userFound) {
                    done(null, userFound);
                })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    userFound.update({
                        username: (username ? username : userFound.username),
                        email: (email ? email : userFound.email)
                    }).then(function () {
                        done(userFound);
                    }).catch(function (err) {
                        res.status(500).json({ 'error': 'cannot update user' });
                    });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ], function (userFound) {
            if (userFound) {
                return res.status(201).json(userFound);
            } else {
                return res.status(500).json({ 'error': 'cannot update user profile' });
            }
        });
    }
}