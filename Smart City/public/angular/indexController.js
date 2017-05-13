/**
 * Created by amitpandey on 5/9/17.
 */
var myApp=angular.module("myApp", [])
myApp.controller("AppCtrl", function($scope,$http,$window) {


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
    }


});






