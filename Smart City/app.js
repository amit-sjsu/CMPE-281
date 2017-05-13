/**
 * Module dependencies.
**/

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , session = require('client-sessions')

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

var home = require('./routes/home')
var mongoose = require('mongoose');
var userSchema = require('./routes/User.js');
var jobSchema = require('./routes/Job.js');
var eventSchema = require('./routes/Event.js');
var accomodationSchema = require('./routes/Accomodation.js');
var User = mongoose.model('User',userSchema);
var Job = mongoose.model('Job', jobSchema);
var Event = mongoose.model('Event', eventSchema);
var Accomodation = mongoose.model('Accomodation', accomodationSchema);
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var app = express();

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://root:root@ds131041.mlab.com:31041/spartascoop')



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
app.get('/login', home.redirectToDashboard);
app.get('/profilefeed', home.redirectToUserProfile);
app.get('/SpartaEvents', home.redirectToEvents);
app.get('/AdminDashboard', home.redirectToAdminProfile);
app.get('/forgotPassword', home.redirectToforgotPassword);
app.get('/profileCompletion', home.redirectToProfileCompletion);
app.get('/accomodation', home.redirectToAccomodation);



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






app.post('/v1/users/login', function(req, res){
    console.log('[api] authenticating - ' + req.body.user_emailid);
    console.log('[api] authenticating - ' + req.body.password);
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log('[api] ' + req.body);

    if(req.body.user_emailid==="gaurav.misra@sjsu.edu")
        return res.status(200).send('{"message":"Login successful","userType":"admin"}');

    User.find({user_emailid:req.body.user_emailid}, function(error, user){



        if(error){
            res.status(404).send('{ "message" : "User not found"}');
        }
        else if(user.length === 0 )
        {
            res.status(404).send('{ "message" : "User not found"}');
        }
        else{
            var temp = JSON.parse(JSON.stringify(user));

            console.log(temp);

            var in_pwd = req.body.password;
            var usr_pwd = temp[0]['user_password'];

            // compare the passwords
            if(in_pwd !== usr_pwd)
            {
                console.log('[api] login fail');
                return res.status(404).send('{"message":"Login failed"}');
            }
            else
            { console.log('[api] login success');
            req.session.user_emailid = user.user_emailid;
            console.log("current user email" +user.user_emailid);
                    return res.status(200).send('{"message":"Login successful","userType":"user"}');

            }
        }
    });
});


app.get('/v1/jobs', function(req, res){
    Job.find({}, function(error, jobs){
        if(error) res.status(500).send('{ "message" : "Unable to fetch jobs"}');
        res.status(200).json(jobs.reverse());
    });
});


app.post('/v1/users', function(req, res){

    User.find({user_emailid:req.body.user_emailid},function(error, user){
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



app.get('/v1/analytics/postcounts', function(req, res){
    var counts = {};
    Event.find({}, function(e1, es){
        counts.events = es.length;
        Job.find({}, function(e2, jb){
            counts.jobs = jb.length;
            Accomodation.find({}, function(e3,as){
                counts.accomodations = as.length;
                res.status(200).send(counts);
            });
        });
    });
});

// get no of users from each branch
app.get('/v1/analytics/majorcounts', function(req, res){
    var majorcounts = {};
    User.find({"user_major": "IE"}, function(e1, es){
        majorcounts.IE = es.length;
        User.find({"user_major": "CS"}, function(e2, cs){
            majorcounts.CS = cs.length;
            User.find({"user_major": "SE"}, function(e2, se){
                majorcounts.SE = se.length;
                User.find({"user_major": "EE"}, function(e2, ee){
                    majorcounts.EE = ee.length;
                    User.find({"user_major": "CE"}, function(e2, ce){
                        majorcounts.CE = ce.length;
                        res.status(200).send(majorcounts);
                    });
                });
            });
        });
    });
});

// get no of accomodations according to price range
app.get('/v1/analytics/accomodationprices', function(req, res){
    var pricerangecounts = {};
    Accomodation.find({rent : {$lte:400}}, function(e,a){
        console.log("a < 400 :" + a.length);
        pricerangecounts.low = a.length;
        Accomodation.find({rent : {$gt:400, $lte:600}}, function(e,a2){
            pricerangecounts.mid = a2.length;
            Accomodation.find({rent : {$gt:600}}, function(e,a3){
                pricerangecounts.high = a3.length;
                res.status(200).send(pricerangecounts);
            });
        });

    });
});


// get no of jobs according to pay
app.get('/v1/analytics/jobrates', function(req, res){
    var jobratecounts = {};
    Job.find({payrate : {$lte:12}}, function(e,a){
        jobratecounts.low = a.length;
        Job.find({payrate : {$gt:12, $lte:18}}, function(e,a2){
            jobratecounts.mid = a2.length;
            Job.find({payrate : {$gt:18}}, function(e,a3){
                jobratecounts.high = a3.length;
                res.status(200).send(jobratecounts);
            });
        });
    });
});

// get no of events according to fees
app.get('/v1/analytics/eventscount', function(req, res){
    var eventscounts = {};
    Event.find({entryfees : {$lte:15}}, function(e,a){
        eventscounts.low = a.length;
        Event.find({entryfees : {$gt:15, $lte:30}}, function(e,a2){
            eventscounts.mid = a2.length;
            Event.find({entryfees : {$gt:30}}, function(e,a3){
                eventscounts.high = a3.length;
                res.status(200).send(eventscounts);
            });
        });
    });
});


app.post('/v1/jobs',function(req, res){
    var job = Job(req.body);
    job.save(function(er){
        if(er) res.status(500).send('{ "message" : "Unable to save job"}');
        else res.status(200).json(Job(req.body));
    });
});



// update user profile - with email id
app.put('/v1/users/:user_emailid', function(req, res){

    // console.log(req.body);

    // first find the user and then update him/her
    User.find({user_emailid:req.params.user_emailid},function(error, user){
        // console.log(user[0]);

        var up = user[0];

        var new_user = req.body;

        up.username = new_user.username;
        up.user_emailid = new_user.user_emailid;
        up.user_profilepicture_url = new_user.user_profilepicture_url;
        up.user_password = new_user.user_password;
        up.user_major = new_user.user_major;
        up.user_degree = new_user.user_degree;

        console.log(up.user_profilepicture_url);

        if(error){res.status(404).send('{ "message" : "User not found"}');}
        else{
            console.log("[api] user found");

            User.findOneAndUpdate({'user_emailid':req.params.user_emailid},up,function(e,u){
                if(e) return res.status(500).send('{ "status" : "Failed to update user" }');
                else{
                    console.log("[api] user updated");
                    res.status(200).send(new_user);
                }
            });
        }
    });
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// EVENT API v1.0.0

// get all events
app.get('/v1/events', function(req, res){
    Event.find({}, function(err, events){
        if(err) res.status(500).send('{ "message" : "Unable to fetch events"}');
        res.status(200).json(events.reverse());
    });
});
//
// // get a particular event
// app.get('/v1/events/:eventId', function(req, res){
//     Event.find( { _id:req.params.eventId }, function(error, event){
//         if(event.length == 0){
//             res.status(404).send('{ "message" : "Event not found"}');
//         }
//         if(error) res.status(500).send('{ "message" : "Unable to fetch events"}');
//         res.status(200).json(event[0]);
//     });
// });
//
// // create new event

app.post('/v1/events', jsonParser, function(req, res){
    var e = Event(req.body);
    e.save(function(err){
        if(err) res.status(500).send('{ "message" : "Unable to save event"}');
        else res.status(200).json(req.body);
    });
});
//
// // update event
// app.put('/v1/events/:eventid', jsonParser, function(req, res){
//     // first find the user and then update him/her
//     Event.find({_id:req.params.eventid},function(error, event){
//         if(error){res.status(404).send('{ "message" : "Event not found"}');}
//         else if(event.length ==0){
//             res.status(404).send('{ "message" : "Event not found"}');
//         }
//         else{
//             console.log("[api] event found");
//             var nevent = req.body;
//             Event.findOneAndUpdate({_id:req.params.eventid},nevent,function(e,u){
//                 if(e) return res.status(500).send('{ "status" : "Failed to update event" }');
//                 else{
//                     console.log("[api] event updated");
//                     res.status(200).send(nevent);
//                 }
//             });
//         }
//     });
// });
//
//
// // delete event
// app.delete('/v1/events/:eventid', function(req, res){
//     Event.find({_id:req.params.eventid}, function(err, event){
//         console.log(event);
//         if(err) {
//             res.status(500).send('{ "message" : "Unable to delete event"}');
//         }
//         else if(event.length == 0){
//             res.status(404).send('{ "message" : "Event not found"}');
//         }
//         else{
//             try{
//                 Event.findOneAndRemove({_id:req.params.eventid}, function(error){
//                     if(error) return res.status(500).send('{ "status" : "Unable to delete event" }');
//                     else{
//                         res.status(200).send('{ "status" : "Event deleted" }');
//                     }
//                 });
//             }
//             catch(e){
//                 res.status(404).send('{ "message" : "Event not found"}');
//             }
//         }
//     });
// });


//accomodation


app.get('/v1/accomodations', function(req, res){
    console.log("I am in accomodation");
    Accomodation.find({}, function(err, accomodations){
        if(err) res.status(500).send('{ "message" : "Unable to fetch accomodations"}');
        console.log("get accomodation gives"+accomodations);
        res.status(200).json(accomodations);
    });
});



app.post('/v1/accomodations', jsonParser, function(req,res){
    var acc = Accomodation(req.body);
    acc.save(function(err){
        if(err)res.status(500).send('{ "message" : "Unable to save accomodation"}');
        else res.status(200).json(acc);
    });
});






// **** event controller ends here ***********
