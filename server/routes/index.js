var dataController = require('./users.js');

module.exports = function (app,passport) {


    app.get('/',dataController.showHome);
    app.get('/login',dataController.showLogin);
    app.get('/signup',dataController.showSignup);


    // process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
        function(req, res) {
            console.log("hello");

            res.redirect('/');
    });

    app.post('/signup',passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/admin/addbank',dataController.showAddBankAdmin);
    app.post('/admin/addbank',dataController.postAddBankAdmin);

    app.get('/myloan',isLoggedIn,dataController.showMyloan);
    app.post('/myloan',isLoggedIn,dataController.addMyloan);

    app.get('/my/loan/delete/:bid',isLoggedIn,dataController.deleteMyloan);
    app.post('/myloan/delete/:bid',isLoggedIn,dataController.deleteMyloan);

    app.post('/user/Application process/Apply',isLoggedIn,dataController.processApply);
    app.post('/user/Applcation process/withdraw',isLoggedIn,dataController.processWithdraw);

    app.get('/profile',isLoggedIn,dataController.showMyProfile);
    app.post('/profile', isLoggedIn, dataController.processChangePass);

    app.get('/bank/stats',isLoggedIn,dataController.showBankStats);
    app.post('/bank/stats',isLoggedIn,dataController.processBankStats);

};


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}