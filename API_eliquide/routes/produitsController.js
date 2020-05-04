var models   = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwt.utils');

const TITLE_LIMIT   = 2;
const CONTENT_LIMIT = 4;
const ITEMS_LIMIT   = 50;

module.exports = {
    createEliquide: function (req, res) {
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        var nom = req.body.nom;
        var description = req.body.description;
        var pg = req.body.pg;
        var vg = req.body.vg;
        var nicotine = req.body.nicotine;
        var contenance = req.body.contenance;

        if (nom == null || description == null || pg == null || vg == null || nicotine == null || contenance == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    where: { id: userId }
                })
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    models.Eliquide.create({
                        nom: nom,
                        description: description,
                        pg: pg,
                        vg: vg,
                        nicotine: nicotine,
                        origine: origine,
                        contenance: contenance,
                        type_saveur: type_saveur,
                        UserId: userFound.id
                    })
                        .then(function (newEliquide) {
                            done(newEliquide);
                        });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ], function (newEliquide) {
            if (newEliquide) {
                return res.status(201).json(newEliquide);
            } else {
                return res.status(500).json({ 'error': 'cannot post eliquide' });
            }
        });
    },
    listEliquides: function (req, res) {
        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;

        if (limit > ITEMS_LIMIT) {
            limit = ITEMS_LIMIT;
        }

        models.Eliquide.findAll({
            order: [(order != null) ? order.split(':') : ['nom', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            include: [{
                model: models.User,
                attributes: ['username']
            }]
        }).then(function (eliquides) {
            if (eliquides) {
                res.status(200).json(eliquides);
            } else {
                res.status(404).json({ "error": "no eliquides found" });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).json({ "error": "invalid fields" });
        });
    }
}