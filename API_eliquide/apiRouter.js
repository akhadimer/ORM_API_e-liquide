var express = require('express');
var usersController = require('./routes/usersController');
var produitsController = require('./routes/produitsController');

exports.router = (function() {
    var apiRouter = express.Router();

    apiRouter.route('/users/register/').post(usersController.register);
    apiRouter.route('/users/login/').post(usersController.login);
    apiRouter.route('/users/me/').get(usersController.getUserProfile);
    apiRouter.route('/users/me/').put(usersController.updateUserProfile);

    apiRouter.route('/eliquides/new/').post(produitsController.createEliquide);
    apiRouter.route('/eliquides/').get(produitsController.listEliquides);

    return apiRouter;
})();