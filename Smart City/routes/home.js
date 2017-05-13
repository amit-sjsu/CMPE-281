
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

exports.redirectToDashboard= function(req,res) {
    res.render('index');
};

exports.redirectToUserProfile = function(req,res) {
    res.render('feed');
};

exports.redirectToAdminProfile = function(req,res) {
    res.render('admin');
};

exports.redirectToProfileCompletion = function(req,res) {
    res.render('completeProfile');
};
exports.redirectToforgotPassword=function(req,res){
    res.render('forgotpassword');
}

exports.redirectToEvents=function(req,res){
    res.render('Events');
}
exports.redirectToAccomodation=function(req,res){
    res.render('accomodation');
}

