/**
 * Created by amitpandey on 5/9/17.
 */
var myApp=angular.module("myApp", []);
myApp.controller("AppCtrl", function($scope,$http,$window) {






    $http({
        method: "GET",
        url: '/v1/communities',
        data: {}
    }).success(function (data) {
        console.log(data);
        $scope.communities = data;

    }).error(function (error) {
        console.log("inside error");
        console.log(error);
        $scope.unexpected_error = false;
        $scope.invalid_login = true;
        // $window.alert("unexpected_error");
    });

    $scope.adminDashboard=function() {
        window.location.assign("/AdminDashboard");
    }

    $scope.login=function() {

        var email=$scope.user;

        if(email==="admin@gmail.com")
        {
            window.location.assign("/AdminDashboard");
        }

        else{

            $http({
                method: "GET",
                url: '/v1/users/'+email,
                data: {}
            }).success(function (data) {




                console.log(data);   console.log(data[0].community);
                sessionStorage.setItem("user",JSON.stringify(data[0]));
                sessionStorage.setItem("UserName",data[0].name);
                sessionStorage.setItem("community",JSON.stringify(data[0].community));
                window.location.assign("/login");

            }).error(function (error) {

                $scope.unexpected_error = false;
                $scope.invalid_login = true;
                $window.alert("Login Failed");
                window.location.assign("/");

            });


        }


    }
    $scope.signup=function() {
        window.location.assign("/signup");
    }

    $scope.ConnectCluster=function() {

        sessionStorage.setItem("email",$scope.email);
        sessionStorage.setItem("UserName",$scope.name);

        $http({
            method : "POST",
            url : '/v1/users',
            data : {
                name:$scope.name,
                email:$scope.email,
                address:$scope.address,
                phone:$scope.phone,
                password:$scope.password
            }
        }).success(function(data) {
            window.location.assign("/connectCluster");

        }).error(function(error) {
            window.location.assign("/signup");

            $scope.unexpected_error = false;
            $scope.invalid_login = true;
            window.location.assign("/signup");
        });

    }

    $scope.getConnected=function() {

        $scope.community=$scope.communityName;

        for(var i=0;i<$scope.communities.length;i++)
        {
            if($scope.communities[i].name===$scope.community)
                $scope.Usercommunity=$scope.communities[i];
        }

        // console.log( $scope.Usercommunity);

        sessionStorage.setItem("community",JSON.stringify($scope.Usercommunity));

        // console.log(JSON.parse(sessionStorage.getItem("community")));


        $http({
            method : "PUT",
            url : '/v1/users/'+sessionStorage.getItem("email"),
            data : {
                community: $scope.Usercommunity,
                servivces:$scope.Usercommunity.services
            }
        }).success(function(data) {
            console.log("users====="+data)
            sessionStorage.setItem("user",JSON.stringify(data));
            window.location.assign("/ClientDashboard");


        }).error(function(error) {
            window.location.assign("/connectCluster");
            $scope.unexpected_error = false;
            $scope.invalid_login = true;
            // $window.alert("unexpected_error");
        });

    }

    $scope.services = [{
        "_id": "5917d621ef2f6a561acb66f1",
        "title": "Disaster",
        "description": "Baarish aai to bataunga",
        "status": true,
        "url": "sdfsjfn",
        "servicesprovided": "sdjflnsdf",
        "__v": 0
    }, {
        "_id": "5917eb1845ed185ac111ead2",
        "title": "Crime Service",
        "description": "Crime Service",
        "status": true,
        "url": "crime.org",
        "servicesprovided": "Crime service",
        "__v": 0
    },   {
        "_id": "59192c76723b2d610c89fbaf",
        "title": "Weather Report",
        "description": "Tells you the weather in your area",
        "status": true,
        "url": "weather.com",
        "servicesprovided": "Weather Forcasts",
        "__v": 0
    },
        {
            "_id": "591a0fe239e441658e7f6209",
            "title": "Weather reporting",
            "description": "Weather reporting",
            "status": true,
            "url": "Weather reporting",
            "servicesprovided": "Weather reporting",
            "__v": 0
        }];

    $scope.addCluster = function() {

        console.log("Adding new cluster"+$scope.services);
        $http({
            method:'post',
            url:'/v1/communities',
            data:{
                "name":$scope.clusterName,
                "address":$scope.clusterAddress,
                "url":$scope.clusterUrl,
                "communityRepresentative":$scope.communityRepresentative,
                "services": $scope.services
                //services to be included here
            }
        }).success(function(data) {
            console.log("New Cluster Added!");
        });
    }

    $scope.getCluster = function() {
        console.log("Getting all the clusters");
        $http({
            method: 'get',
            url: '/v1/communities'
        }).success(function(data) {
            console.log("Getting all the clusters");
            $scope.allcluster = data;
        });
    }

    $scope.deleteCluster = function(id) {
        console.log(id);

        $http({
            method: 'delete',
            url: '/v1/communities/'+id
        }).success(function(data) {
            console.log("Deleted successfully");
            // $window.alert("Cluster Deleted!");
        });
    }


    $scope.addService = function() {
        console.log("Adding a new service");
        console.log($scope.serviceStatus);

        $http({
            method: 'post',
            url: '/v1/services',
            data: {
                title: $scope.serviceTitle,
                description: $scope.serviceDescription,
                status: $scope.serviceStatus,
                url: $scope.serviceURL,
                servicesprovided: $scope.servicesProvided
            }
        });
    }

    $scope.getService = function() {
        console.log("Getting all the services");
        $http({
            method: 'get',
            url: '/v1/services'
        }).success(function(data) {
            console.log(data);
            $scope.allservice = data;
        });
    }

    $scope.deleteService = function(id) {
        console.log(id);

        $http({
            method: 'delete',
            url: '/v1/services/'+id
        }).success(function(data) {
            console.log("Service Deleted successfully");
            // $window.alert("Cluster Deleted!");
        });
    }

    $scope.getUser = function() {

        $http({
            method: 'get',
            url: '/v1/users'
        }).success(function(data) {
            $scope.alluser = data;
        });
    }


    $scope.postannouncement = function() {

        $http({
            method: 'post',
            url: '/v1/announcements',
            data: {
                message: $scope.message,
                date: Date.now()
            }
        }).success(function(data) {
           console.log("Announcement completed");
        });
    }



//******************************* Services Checkbox **************************************
    // $scope.services = ['Crime Alert','Weather Report','Parking','Health Benefits'];
    //
    // $scope.selectedservice = [];
    //
    // $scope.selectservices = function(service) {
    //     var index = $scope.selectedservice.indexOf(service);
    //
    //     if (index > -1)
    //     {
    //         //if already selected then removed
    //         $scope.selectedservice.splice(index, 1);
    //     }
    //     else
    //     {
    //         //if not selected then added
    //         $scope.selectedservice.push(service);
    //     }
    //     console.log($scope.selectedservice);
    // };



  //
  // $scope.addContact=function() {
  //       console.log($scope.contact);
  //       $http.post('/contactlist',$scope.contact).then(successCallback, errorCallback);
  //
  //       function successCallback(response){
  //
  //           $scope.title=response.data;
  //           console.log($scope.title.title);
  //           window.location.assign("/products");
  //           // $window.location.href = 'test.html';
  //
  //       }
  //       function errorCallback(error){
  //       }
  //
  //   }
  //
  //   $scope.login=function() {
  //
  //       if ( $scope.email=== undefined) {
  //
  //       }
  //       else if( $scope.password=== undefined){
  //
  //       }
  //       else {
  //
  //           $http({
  //               method: "POST",
  //               url: '/v1/users/login',
  //               data: {
  //                   user_emailid: $scope.email,
  //                   password: $scope.password
  //
  //               }
  //           }).success(function (data) {
  //               if (data.userType == "user")
  //                   window.location.assign("/profilefeed");
  //               if (data.userType == "admin")
  //                   window.location.assign("/AdminDashboard");
  //
  //           }).error(function (error) {
  //
  //
  //               $scope.unexpected_error = false;
  //               $scope.invalid_login = true;
  //               // $window.alert("unexpected");
  //
  //               if(error.message==="Login failed")
  //               {
  //                   swal(
  //                       'Oops...',
  //                       'Username and password did not match!',
  //                       'error'
  //                   )
  //               }
  //               else {
  //                   swal(
  //                       'Oops...',
  //                       'You are not registered',
  //                       'error'
  //                   )
  //               }
  //
  //
  //           });
  //
  //       }
  //   }
  //
  //   $scope.register=function() {
  //
  //
  //     sessionStorage.setItem("username",$scope.username);
  //       sessionStorage.setItem("email",$scope.user_email);
  //       sessionStorage.setItem("password",$scope.user_password);
  //
  //
  //       $http({
  //           method : "POST",
  //           url : '/v1/users',
  //           data : {
  //               username:$scope.username,
  //               user_emailid:$scope.user_email,
  //               user_password:$scope.user_password
  //           }
  //       }).success(function(data) {
  //           window.location.assign("/profileCompletion");
  //           // window.location.assign("/profilefeed");
  //
  //       }).error(function(error) {
  //           console.log("inside error");
  //           console.log(error);
  //           $scope.unexpected_error = false;
  //           $scope.invalid_login = true;
  //           // $window.alert("unexpected_error");
  //       });
  //
  //   }
  //
  //
  //   $scope.completeProfile=function() {
  //
  //
  //       // var Imgurl="https://avatars3.githubusercontent.com/u/4065884?v=3&u=a0ac43ec7cabf27ed83139f0674e0c9d46e12ea3&s=400";
  //
  //       console.log(sessionStorage.getItem("email"));
  //       console.log(sessionStorage.getItem("username"));
  //       console.log(sessionStorage.getItem("password"));
  //
  //       var username=sessionStorage.getItem("username");
  //       var email=sessionStorage.getItem("email");
  //       var pass=sessionStorage.getItem("password");
  //       var Imgurl=sessionStorage.getItem("imageSrc");
  //       console.log(Imgurl);
  //
  //       $http({
  //           method : "PUT",
  //           url : '/v1/users/'+email,
  //
  //           // console.log("this is url"+url);
  //           data : {
  //               username: username,
  //               user_emailid:email,
  //               user_password:pass,
  //               user_major:$scope.major,
  //               user_degree:$scope.degree,
  //               user_profilepicture_url:Imgurl
  //           }
  //
  //       }).success(function(data) {
  //           console.log(data);
  //           // window.location.assign("/profileCompletion");
  //           window.location.assign("/profilefeed");
  //
  //       }).error(function(error) {
  //           console.log("inside error");
  //           console.log(error);
  //           $scope.unexpected_error = false;
  //           $scope.invalid_login = true;
  //           $window.alert("unexpected_error");
  //       });
  //
  //   }
  //
  //
  //   $scope.forgotPassword=function() {
  //       window.location.assign("/forgotPassword");
  //   }
  //
  //
  //   $scope.SkipProfile=function() {
  //       window.location.assign("/profilefeed");
  //   }

    $scope.getChart = function() {
        console.log("Control coming here");
        // $http({
        //     method: 'get',
        //     url: '/getChart'
        //
        // }).success(function (result) {
        //     console.log("Getting top ten properties" + result[0]);
        //     $scope.topTenProperties = result;


        Highcharts.chart('container1', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Number of Users per Cluster'
            },
            // subtitle: {
            //     text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
            // },
            xAxis: {
                type: 'category',
                title: {
                    text: 'Clusters'
                }
            },
            yAxis: {
                title: {
                    text: 'Number of Users'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:f}'
                    }
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:f}<br/>'
            },

            series: [{
                name: 'Clusters',
                colorByPoint: true,
                data: [{
                    name: '101 San Fernando',
                    y: 20,
                    drilldown: '101 San Fernando'
                }, {
                    name: 'Villa Torino',
                    y: 25,
                    drilldown: 'Villa Torino'
                }, {
                    name: 'Morrison Park',
                    y: 12,
                    drilldown: 'Morrison Park'
                }, {
                    name: 'Cahill Park',
                    y: 27,
                    drilldown: 'Cahill Park'
                }, {
                    name: '33 South',
                    y: 14,
                    drilldown: '33 South'
                }]
            }],
            drilldown: {}
        });

//        })



        Highcharts.chart('container2', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Number of Users per Service'
            },
            // subtitle: {
            //     text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
            // },
            xAxis: {
                type: 'category',
                title: {
                    text: 'Services'
                }
            },
            yAxis: {
                title: {
                    text: 'Number of Users'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y:f}'
                    }
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:f}<br/>'
            },

            series: [{
                name: 'Services',
                colorByPoint: true,
                data: [{
                    name: 'Crime Alert',
                    y: 60,
                    drilldown: 'Crime Alert'
                }, {
                    name: 'Event Notifications',
                    y: 45,
                    drilldown: 'Event Notifications'
                }, {
                    name: 'Parking',
                    y: 16,
                    drilldown: 'Parking'
                }, {
                    name: 'Weather Report',
                    y: 46,
                    drilldown: 'Weather Report'
                }]
            }],
            drilldown: {}
        });
    }


    // $scope.login=function() {
    //     window.location.assign("/login");
    // };


});






