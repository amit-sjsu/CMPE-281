/**
 * Module dependencies.
**/

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    session = require('client-sessions');


//var AWS = require('aws-sdk');
//AWS.config.loadFromPath('./config.json');

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// connect to the db
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://admin:abc123@ds139781.mlab.com:39781/crimedb');

console.log('[community api] community db : connected');

var home = require('./routes/home');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var userSchema = require('./routes/User.js');
var User = mongoose.model('user', userSchema);

var communitySchema = require('./routes/User.js');
var Community = mongoose.model('Community', communitySchema);

var crimeSchema = require('./routes/crime.js');
var Crime = mongoose.model('Crime', crimeSchema);

var eventSchema = require('./routes/event.js');
var Event = mongoose.model('Event', eventSchema);


var serviceSchema = require('./routes/service.js');
var Service = mongoose.model('Service', serviceSchema);

var announcementSchema = require('./routes/announcement.js');
var Announcement = mongoose.model('Announcement', announcementSchema);


var jsonParser = bodyParser.json();
var app = express();




app.use(session({   
	  
	cookieName: 'session',    
	secret: 'cmpe273_test_string',    
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently

app.set('port', process.env.PORT || 3000);


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.favicon());


app.use(express.bodyParser());

app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));


if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', home.redirectToHome);
/********************* Amit's update required ****************************/
app.get('/login', home.redirectToClientDashboard);
app.get('/signup', home.redirectToSignup);
app.get('/connectCluster', home.redirectToConnectCluster);
app.get('/ClientDashboard', home.redirectToClientDashboard);
app.get('/AdminDashboard', home.redirectToAdminDashboard);
app.get('/Analytics', home.redirectToAnalytics);

// EC2 instance creation
//
// var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
//
//
// var params = {
//     ImageId: 'ami-c58c1dd3', // amzn-ami-2011.09.1.x86_64-ebs
//     InstanceType: 't2.micro',
//     MinCount: 1,
//     MaxCount: 1,
//
// };
//
// // Create the instance
// ec2.runInstances(params, function(err, data) {
//     if (err) {
//         console.log("Could not create instance", err);
//         return;
//     }
//     var instanceId = data.Instances[0].InstanceId;
//     console.log("Created instance", instanceId);
//     // Add tags to the instance
//     params = {Resources: [instanceId], Tags: [
//         {
//             Key: 'Name',
//             Value: 'SDK Sample'
//
//         },
//         {
//             key:'KeyPairs',
//             Value: 'CMPE275_ZHANG'
//         }
//     ]};
//     ec2.createTags(params, function(err) {
//         console.log("Tagging instance", err ? "failure" : "success");
//     });
// });
//
// //end of ec2 creation




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});




//*******************Community controller starts here*********************


// Community API v1.0.0

// get all Community available
app.get('/v1/communities', function(req, res){
    Community.find({}, function(error, community){
        if(error) res.status(500).send('{ "message" : "Unable to fetch community"}');
        res.status(200).json(community.reverse());
    });
});

// get a particular Community
app.get('/v1/communities/:communityid', function(req, res){

    Community.find( { _id:req.params.communityid }, function(error, community){
        if(error) res.status(500).send('{ "message" : "Unable to fetch community"}');
        else if(community.length == 0){
            res.status(404).send('{ "message" : "Community not found"}');
        }
        else
            res.status(200).json(community[0]);
    });
});

// save a new Community
app.post('/v1/communities', jsonParser, function(req, res){
    console.log(req.body);
    console.log(req);
    var community = Community(req.body);
    // console.log(crime);
    community.save(function(er){
        if(er){
            console.log(er);
            res.status(500).send('{ "message" : "Unable to save community"}');
        }
        else res.status(200).json(Community(req.body));
    });
});

// delete a Community
app.delete('/v1/communities/:communityid', function(req, res){
    Community.find({_id:req.params.communityid}, function(err, community){
        // console.log(job);
        if(err) {
            res.status(500).send('{ "message" : "Unable to delete Community"}');
        }
        else if(community.length == 0){
            res.status(404).send('{ "message" : "Community not found"}');
        }
        else{
            try{
                Community.findOneAndRemove({_id:req.params.communityid}, function(error){
                    if(error) return res.status(500).send('{ "status" : "Unable to delete community" }');
                    else{
                        res.status(200).send('{ "status" : "community deleted" }');
                    }
                });
            }
            catch(e){
                res.status(404).send('{ "message" : "Community not found"}');
            }
        }
    });
});

// update a Community
app.put('/v1/communities/:communityid', jsonParser, function(req, res){
    // first find the user and then update him/her
    Community.find({_id:req.params.communityid},function(error, community){
        if(error){res.status(404).send('{ "message" : "community not found"}');}
        else if(community.length ==0){
            res.status(404).send('{ "message" : "community not found"}');
        }
        else{
            console.log("[api] Crime found");
            var ncommunity = req.body;
            Community.findOneAndUpdate({_id:req.params.communityid},ncommunity,function(e,u){
                if(e) return res.status(500).send('{ "status" : "Failed to update community" }');
                else{
                    console.log("[api] community updated");
                    res.status(200).send(ncommunity);
                }
            });
        }
    });
});


//*************** Service modules *******************


// Service API v1.0.0

// get all services available
app.get('/v1/services', function(req, res){
    Service.find({}, function(error, services){
        if(error) res.status(500).send('{ "message" : "Unable to fetch services"}');
        res.status(200).json(services.reverse());
    });
});

// get a particular service
app.get('/v1/services/:serviceid', function(req, res){

    Service.find( { _id:req.params.serviceid }, function(error, service){
        if(error) res.status(500).send('{ "message" : "Unable to fetch service"}');
        else if(service.length == 0){
            res.status(404).send('{ "message" : "Service not found"}');
        }
        else
            res.status(200).json(service[0]);
    });
});

// save a new service
app.post('/v1/services', jsonParser, function(req, res){
    var service = Service(req.body);
    // console.log(crime);
    service.save(function(er){
        if(er){
            console.log(er);
            res.status(500).send('{ "message" : "Unable to save service"}');
        }
        else res.status(200).json(Service(req.body));
    });
});

// delete a service
app.delete('/v1/services/:serviceid', function(req, res){
    Service.find({_id:req.params.serviceid}, function(err, service){
        // console.log(job);
        if(err) {
            res.status(500).send('{ "message" : "Unable to delete service"}');
        }
        else if(service.length == 0){
            res.status(404).send('{ "message" : "Service not found"}');
        }
        else{
            try{
                Service.findOneAndRemove({_id:req.params.serviceid}, function(error){
                    if(error) return res.status(500).send('{ "status" : "Unable to delete service" }');
                    else{
                        res.status(200).send('{ "status" : "Service deleted" }');
                    }
                });
            }
            catch(e){
                res.status(404).send('{ "message" : "Service not found"}');
            }
        }
    });
});

// update a service
app.put('/v1/services/:serviceid', jsonParser, function(req, res){
    // first find the user and then update him/her
    Service.find({_id:req.params.serviceid},function(error, service){
        if(error){res.status(404).send('{ "message" : "service not found"}');}
        else if(service.length ==0){
            res.status(404).send('{ "message" : "service not found"}');
        }
        else{
            console.log("[api] service found");
            var nservice = req.body;
            Service.findOneAndUpdate({_id:req.params.serviceid},nservice,function(e,u){
                if(e) return res.status(500).send('{ "status" : "Failed to update service" }');
                else{
                    console.log("[api] service updated");
                    res.status(200).send(nservice);
                }
            });
        }
    });
});
//

//***************************** User apis start here **************************

// USER API v1.0.0
// get all users
app.get('/v1/users', function(req, res){
    User.find({}, function(error, users){
        if(error) res.status(500).send('{ "message" : "Unable to fetch users"}');
        res.status(200).json(users.reverse());
    });
});

// get particular user by email id
app.get('/v1/users/:email', function(req, res){
    User.find({email:req.params.email}, function(error, user){

        if(error) {
            res.status(500).send('{ "message" : "Failed to find user"}');
        }
        else if(user.length == 0){
            res.status(404).send('{ "message" : "User not found"}');
        }
        else {
            res.status(200).json(user);
        }
    });
});

// create new user
app.post('/v1/users', jsonParser, function(req, res){
    // check if the email id is already taken
    User.find({email:req.body.email},function(error, user){
        if(error){res.status(500).send('{ "message" : "Unable to register user"}');}
        else if(user.length != 0){
            res.status(404).send('{ "message" : "Email already registerd"}');
        }
        else{
            var user = User(req.body).save(function(error){
                if(error) res.status(500).send('{ "message" : "Unable to register user"}');
                res.status(200).json(User(req.body));
            });
        }
    });
});

// delete user profile by email id
app.delete('/v1/users/:email', function(req,res){
    // first find the user and then delete him/her
    User.find({email:req.params.email},function(error, user){
        // console.log(user);
        if(error){res.status(500).send('{ "message" : "Unable to delete user"}');}
        else if(user.length == 0){
            res.status(404).send('{ "message" : "User not found"}');
        }
        else{
            try{
                User.findOneAndRemove( { email:user[0].email }, function(err){
                    if(err) return res.status(500).send('{ "status" : "Unable to delete user" }');
                    res.status(200).send('{ "status" : "User deleted" }');
                });
            }
            catch(error){
                res.status(404).send('{ "message" : "User not found"}');
            }
        }
    });
});

// update user profile - with email id
app.put('/v1/users/:email', jsonParser, function(req, res){
    // first find the user and then update him/her
    User.find({email:req.params.email},function(error, user){
        if(error){res.status(404).send('{ "message" : "User not found"}');}
        else{
            console.log("[api] user found");
            var new_user = req.body;
            User.findOneAndUpdate({'email':req.params.email},new_user,function(e,u){
                if(e) return res.status(500).send('{ "status" : "Failed to update user" }');
                else{
                    console.log("[api] user updated");
                    res.status(200).send(new_user);
                }
            });
        }
    });
});



//***************************** Crime services apis start here **************************

// get all crimes available
app.get('/v1/crimes', function(req, res){
    Crime.find({}, function(error, crimes){
        if(error) res.status(500).send('{ "message" : "Unable to fetch crimes"}');
        res.status(200).json(crimes.reverse());
    });
});

// get a particular crime
app.get('/v1/crimes/:crimeid', function(req, res){

    Crime.find( { _id:req.params.crimeid }, function(error, crime){
        if(error) res.status(500).send('{ "message" : "Unable to fetch crime"}');
        else if(crime.length == 0){
            res.status(404).send('{ "message" : "Crime not found"}');
        }
        else
            res.status(200).json(crime[0]);
    });
});

// save a new crime
app.post('/v1/crimes', jsonParser, function(req, res){


    console.log(req.body);

    var crime = Crime(req.body);
    console.log(crime);


    crime.save(function(er){
        if(er){
            console.log(er);
            res.status(500).send('{ "message" : "Unable to save Crime"}');
        }
        else res.status(200).json(Crime(req.body));
    });
});

// delete a crime
app.delete('/v1/crimes/:crimeid', function(req, res){
    Crime.find({_id:req.params.crimeid}, function(err, crime){
        // console.log(job);
        if(err) {
            res.status(500).send('{ "message" : "Unable to delete crime"}');
        }
        else if(crime.length == 0){
            res.status(404).send('{ "message" : "Crime not found"}');
        }
        else{
            try{
                Crime.findOneAndRemove({_id:req.params.crimeid}, function(error){
                    if(error) return res.status(500).send('{ "status" : "Unable to delete job" }');
                    else{
                        res.status(200).send('{ "status" : "Crime deleted" }');
                    }
                });
            }
            catch(e){
                res.status(404).send('{ "message" : "Crime not found"}');
            }
        }
    });
});

// update a crime
app.put('/v1/crimes/:crimeid', jsonParser, function(req, res){
    // first find the user and then update him/her
    Crime.find({_id:req.params.crimeid},function(error, crime){
        if(error){res.status(404).send('{ "message" : "Crime not found"}');}
        else if(crime.length ==0){
            res.status(404).send('{ "message" : "Crime not found"}');
        }
        else{
            console.log("[api] Crime found");
            var ncrime = req.body;
            Crime.findOneAndUpdate({_id:req.params.crimeid},ncrime,function(e,u){
                if(e) return res.status(500).send('{ "status" : "Failed to update crime" }');
                else{
                    console.log("[api] crime updated");
                    res.status(200).send(ncrime);
                }
            });
        }
    });
});


//end of crime services



// EVENT API v1.0.0

// get all events
app.get('/v1/events', function(req, res){

    console.log("I am in event api for GET");
    console.log(req.body);

    Event.find({}, function(err, events){
        if(err) res.status(500).send('{ "message" : "Unable to fetch events"}');
        res.status(200).json(events.reverse());
    });
});

// get a particular event
app.get('/v1/events/:eventId', function(req, res){
    Event.find( { _id:req.params.eventId }, function(error, event){
        if(event.length == 0){
            res.status(404).send('{ "message" : "Event not found"}');
        }
        if(error) res.status(500).send('{ "message" : "Unable to fetch events"}');
        res.status(200).json(event[0]);
    });
});

// create new event
app.post('/v1/events', jsonParser, function(req, res){

    console.log("I am in event api for now");
    console.log(req.body);

    var e = Event(req.body);
    e.save(function(err){
        if(err) res.status(500).send('{ "message" : "Unable to save event"}');
        else res.status(200).json(req.body);
    });
});

// update event
app.put('/v1/events/:eventid', jsonParser, function(req, res){
    // first find the user and then update him/her
    Event.find({_id:req.params.eventid},function(error, event){
        if(error){res.status(404).send('{ "message" : "Event not found"}');}
        else if(event.length ==0){
            res.status(404).send('{ "message" : "Event not found"}');
        }
        else{
            console.log("[api] event found");
            var nevent = req.body;
            Event.findOneAndUpdate({_id:req.params.eventid},nevent,function(e,u){
                if(e) return res.status(500).send('{ "status" : "Failed to update event" }');
                else{
                    console.log("[api] event updated");
                    res.status(200).send(nevent);
                }
            });
        }
    });
});


// delete event
app.delete('/v1/events/:eventid', function(req, res){
    Event.find({_id:req.params.eventid}, function(err, event){
        // console.log(event);
        if(err) {
            res.status(500).send('{ "message" : "Unable to delete event"}');
        }
        else if(event.length == 0){
            res.status(404).send('{ "message" : "Event not found"}');
        }
        else{
            try{
                Event.findOneAndRemove({_id:req.params.eventid}, function(error){
                    if(error) return res.status(500).send('{ "status" : "Unable to delete event" }');
                    else{
                        res.status(200).send('{ "status" : "Event deleted" }');
                    }
                });
            }
            catch(e){
                res.status(404).send('{ "message" : "Event not found"}');
            }
        }
    });
});

// **** event controller ends here ***********




// user login
// hostname/v1/users/xxx/login
app.post('/v1/users/login', jsonParser, function(req, res){

    console.log('[api] authenticating - ' + req.body.email);

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    console.log('[api] ' + req.body);

    User.find({email:req.body.email}, function(error, user){

        var temp = JSON.parse(JSON.stringify(user));
        if(error){res.status(404).send('{ "message" : "User not found"}');}
        else{
            var in_pwd = req.body.password;
            var usr_pwd = temp[0]['password'];

            // compare the passwords
            if(in_pwd !== usr_pwd)
            {
                console.log('[api] login fail');
                return res.status(200).send('{"message":"Login failed"}');
            }
            else
            {
                console.log('[api] login success');
                // req.session.userid = 1
                return res.status(200).send('{"message":"Login successful"}');

            }
        }
    });
});


//****************** Annoucements API ***********************

// get all Community available
app.get('/v1/announcements', function(req, res){
    Announcement.find({}, function(error, announcements){
        if(error) res.status(500).send('{ "message" : "Unable to fetch Announcement"}');
        res.status(200).json(announcements.reverse());
    });
});

// get a particular Community
app.get('/v1/announcements/:announcementid', function(req, res){
    Announcement.find( { _id:req.params.announcementid }, function(error, announcement){
        if(error) res.status(500).send('{ "message" : "Unable to fetch announcementid"}');
        else if(announcement.length == 0){
            res.status(404).send('{ "message" : "announcementid not found"}');
        }
        else
            res.status(200).json(announcement[0]);
    });
});

// save a new Community
app.post('/v1/announcements', jsonParser, function(req, res){
    var announcement = Announcement(req.body);
    // console.log(crime);
    announcement.save(function(er){
        if(er){
            console.log(er);
            res.status(500).send('{ "message" : "Unable to save announcement"}');
        }
        else res.status(200).json(Announcement(req.body));
    });
});

//*************** Messaging APIs *********************//
var messageSchema = require('./routes/message.js');
var Message = mongoose.model('Message', messageSchema);

// get all Community available
app.get('/v1/messages', function(req, res){
    Message.find({}, function(error, messages){
        if(error) res.status(500).send('{ "message" : "Unable to fetch message"}');
        res.status(200).json(messages.reverse());
    });
});

// get a particular Community
app.get('/v1/messages/:messagesid', function(req, res){
    Message.find( { _id:req.params.messagesid }, function(error, messages){
        if(error) res.status(500).send('{ "message" : "Unable to fetch messages"}');
        else if(messages.length == 0){
            res.status(404).send('{ "message" : "messages not found"}');
        }
        else
            res.status(200).json(messages[0]);
    });
});

// save a new Community
app.post('/v1/messages', jsonParser, function(req, res){
    var message = Message(req.body);
    // console.log(crime);
    message.save(function(er){
        if(er){
            console.log(er);
            res.status(500).send('{ "message" : "Unable to save message"}');
        }
        else {
            console.log("Message sent succesfully");
            res.status(200).json(Message(req.body));
        }
    });
});

app.get('/v1/mymessages/:to',jsonParser, function(req, res){
    Message.find({to:req.params.to }, function(error, messages){
        if(error) res.status(500).send('{ "message" : "Unable to fetch messages"}');
        else if(messages.length == 0){
            res.status(404).send('{ "message" : "messages not found"}');
        }
        else
            res.status(200).json(messages.length > 10 ? messages.reverse().slice(0,9) : messages.reverse()) ;
    });
});


//****************** Amit API ****************************//
