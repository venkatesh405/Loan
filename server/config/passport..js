var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = require('./db.js');
var connection = mysql.createConnection(dbconfig.connection);

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.uid);
    });

    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE uid = ? ",[id], function(err, rows){
            console.log("id: " + rows);
            done(err, rows[0]);
        });
    });


    passport.use(
        'local-signup',
        new LocalStrategy({
                usernameField : 'email',
                passwordField : 'password',
                passReqToCallback : true 
            },
            function(req, email, password, done) {
                var FullName = req.body.fullname;

                connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        var newUserMysql = {
                            email: email,
                            name: FullName,
                            password: bcrypt.hashSync(password, null, null)  

                        };
                        var insertQuery = "INSERT INTO users ( email, name, password ) values (?,?,?)";
                        connection.query(insertQuery,[newUserMysql.email,newUserMysql.name, newUserMysql.password],function(err, rows) {
                            console.log(insertQuery);
                            newUserMysql.uid = rows.insertId;
                            return done(null, newUserMysql);
                        });
                    }
                });
            })
    );



    passport.use(
        'local-login',
        new LocalStrategy({
                
                usernameField : 'email',
                passwordField : 'password',
                passReqToCallback : true 
            },
            function(req, email, password, done) { 
                connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows){
                    if (err)
                        return done(err);
                    if (!rows.length) {
                        return done(null, false, req.flash('loginMessage', 'No user found.')); 
                    }
                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(password, rows[0].password))
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                    // all is well, return successful user
                    return done(null, rows[0]);
                });
            })
    );

};