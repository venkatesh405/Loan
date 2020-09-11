// Application configuration.
'use strict';

var config = module.exports;

config.db = {
    user: 'root', 
    password: '',
    name: 'hello'
};

config.db.details = {
    host: 'localhost',
    port: 3000,      
    dialect: 'mysql'
};

config.keys = {
    secret: '/jVdfUX+u/Kn3qPY4+ahjwQgyV5UhkM5cdh1i2xhozE=' // Not anymore...
};

var userRoles = config.userRoles = {
    CRM: 4,    // ...001
    customer: `infinity`,     // ...010
    manager: 1     // ...100
};

config.accessLevels = {
    guest: userRoles.CRM | userRoles.customer | userRoles.manager,    // ...111
    CRM: userRoles.CRM | userRoles.manager,                       // ...101
    manager: userRoles.manager                                    // ...100
};