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
        window.location.assign("/login");
    }
    $scope.signup=function() {
        window.location.assign("/signup");
    }

    $scope.ConnectCluster=function() {

        sessionStorage.setItem("email",$scope.email);

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
            // $window.alert("unexpected_error");
        });

    }

    $scope.getConnected=function() {

        $scope.community=$scope.coomunityName;
        for(var i=0;i<$scope.communities.length;i++)
        {
            if($scope.communities[i].name===$scope.community)
                $scope.Usercommunity=$scope.communities[i];
        }

        console.log( $scope.Usercommunity);

        sessionStorage.setItem("community",JSON.stringify($scope.Usercommunity));

        console.log(JSON.parse(sessionStorage.getItem("community")));


        $http({
            method : "PUT",
            url : '/v1/users/'+sessionStorage.getItem("email"),
            data : {
                name: $scope.Usercommunity
            }
        }).success(function(data) {

            window.location.assign("/ClientDashboard");


        }).error(function(error) {
            window.location.assign("/connectCluster");
            $scope.unexpected_error = false;
            $scope.invalid_login = true;
            // $window.alert("unexpected_error");
        });

    }


    $scope.addCluster = function() {
        console.log("Adding new cluster");
        $http({
            method:'post',
            url:'/v1/communities',
            data:{
                "name":$scope.clusterName,
                "address":$scope.clusterAddress,
                "url":$scope.clusterUrl,
                "communityRepresentative":$scope.communityRepresentative
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
            console.log("Getting all the services");
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

    $scope.login=function() {
        window.location.assign("/login");
    };


});






