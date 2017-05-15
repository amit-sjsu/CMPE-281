
var winston = require('winston');

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)(),
		new (winston.transports.File)({ filename: 'ebayLog.log' })
	]
});


exports.redirectToHome = function(req,res) {
    res.render('login');
};

exports.redirectToSignup = function(req,res) {
    res.render('Signup');
};

exports.redirectToConnectCluster = function(req,res) {
    res.render('ConnectCluster');
};

exports.redirectToClientDashboard = function(req,res) {
    res.render('ClientIndex');
};


exports.redirectToAdminDashboard = function(req,res) {
    res.render('index');
};

exports.redirectToAnalytics = function(req, res) {
    res.render('analytics');
}