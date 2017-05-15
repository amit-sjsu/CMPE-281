/**
 * Created by vedant on 5/13/17.
 */
var myApp=angular.module("myApp", [])
myApp.controller("ClientCtrl", function($scope,$http,$window) {


    var useremailid=sessionStorage.getItem("email");



    $http({
        method: "GET",
        url: '/v1/communities/'+JSON.parse(sessionStorage.getItem("community"))._id,
        data: {}
    }).success(function (data) {

        $scope.Services = data.services;

    }).error(function (error) {

        $scope.unexpected_error = false;
        $scope.invalid_login = true;
        // $window.alert("unexpected_error");
    });




    $scope.addtocommunity=function() {

        $http({
            method : "POST",
            url : '/v1/users',
            data : {
                username:$scope.username,
                user_emailid:$scope.user_email,
            }
        }).success(function(data) {


            swal({
                title: 'Are you sure you want to post?',
                text: "You won,t  be able to revert you job post!",
                type: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, post it!'
            }).then(function () {
                swal(
                    'Posted!',
                    'Your post has been posted.',
                    'success'
                )
                window.location.assign("/profilefeed");
            })


        }).error(function(error) {
            console.log("inside error");
            console.log(error);
            $scope.unexpected_error = false;
            $scope.invalid_login = true;
            // $window.alert("unexpected_error");
        });

    }

    $scope.displayService= function(e){

        var elem = angular.element(e.srcElement);

        // alert($(elem.parent()).serialize());

    }


});