angular.module("myApp", [])
    .factory('PagerService', PagerService)
    .controller("ClientCtrl", function($scope,$http,$window,PagerService) {


        var useremailid=sessionStorage.getItem("email");
        var UserName=sessionStorage.getItem("UserName");
        $scope.UserValue=UserName;



        $http({
            method: "GET",
            url: '/v1/announcements',
            data: {}
        }).success(function (data) {

            $scope.announcements = data;
            $scope.length=data.length;

        }).error(function (error) {

            $scope.unexpected_error = false;
            $scope.invalid_login = true;
            // $window.alert("unexpected_error");
        });



        // var communityDescription={"Villa"}


        console.log(JSON.parse(sessionStorage.getItem("community"))._id);

        $http({
            method: "GET",
            url: '/v1/communities/'+JSON.parse(sessionStorage.getItem("community"))._id,
            data: {}
        }).success(function (data) {

            $scope.communityName=data.name;
            // $scope.communityDescription=communityDescription.communityName;
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


        $scope.NewCrime = true;
        $scope.NewEvent=true;
        $scope.History = true;
        $scope.communityDetails=false;
        $scope.displayService= function(service){

            getServiceHistory(service);

            if(service=="crime service") {
                $scope.NewEvent = true;
                $scope.NewCrime = false;
                $scope.History = false;
                $scope.communityDetails=true;
                return;

            }
            else if(service=="event service") {
                $scope.NewCrime = true;
                $scope.NewEvent = false;
                $scope.History = false;
                $scope.communityDetails=true;
                return;

            }

            else if(service=="parking service") {

            }
            else if(service=="weather service") {

            }


        }


        function getServiceHistory(service){
            var serviceName;
            if(service==="crime service") {
                serviceName="crimes";
            }

            else if(service==="event service") {
                serviceName="events";
            }




            $http({
                method : "GET",
                url : '/v1/'+serviceName,
                data :{}

            }).success(function(data) {

                // console.log(data);
                $scope.serviceHistory=data;
                $scope.post = data;
                $scope.dummyItems = data
                $scope.pager = {};
                $scope.setPage = setPage;

                initController();

                function initController() {
                    // initialize to page 1
                    $scope.setPage(1);
                }

                function setPage(page) {
                    if (page < 1 || page > $scope.pager.totalPages) {
                        return;
                    }

                    // get pager object from service
                    $scope.pager = PagerService.GetPager($scope.dummyItems.length, page);

                    // get current page of items
                    $scope.items =$scope.dummyItems.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
                }


            }).error(function(error) {

                $scope.unexpected_error = false;
                $scope.invalid_login = true;
                // $window.alert("unexpected_error");
            });

        }



        $scope.jobPost=function(service) {
            var serviceValue;


            if(service==="crimes") {
                serviceValue={
                    title:$scope.title,
                    description:$scope.description,
                    suspect:$scope.suspect,
                    dateandtime:$scope.dateandtime,
                    location:$scope.location,
                    dateposted:$scope.dateposted
                };

            }
            else if (service=== "events")
            {
                serviceValue={
                    title:$scope.title,
                    description:$scope.description,
                    location:$scope.location,
                    website:$scope.website,
                    date:$scope.date,
                    entryfees:$scope.entryfees
                };
            }

            $http({
                method : "POST",
                url : '/v1/'+service,
                data :serviceValue

            }).success(function(data) {

                swal({
                    title: 'Are you sure you want to post?',
                    text: "You won,t  be able to revert !",
                    type: 'success',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, post it!'
                }).then(function () {
                    swal(
                        'Posted!',
                        'Thank You.',
                        'success'
                    )
                    // window.location.assign("/profilefeed");
                })


            }).error(function(error) {

                $scope.unexpected_error = false;
                $scope.invalid_login = true;
                // $window.alert("unexpected_error");
            });


        }


        $scope.Logout =function () {

            sessionStorage.clear('community');
            window.location.assign("/");

        };



        //Subscrip and unsubscribe from a services

        // $scope.Subscribe=true;
        // $scope.Unsubscribe=false;
        //
        var temp;
        $scope.unsubscribe = function (serviceName) {

            temp = JSON.parse(sessionStorage.getItem("user"));
            console.log(temp);
            for(var i =0;i<temp.servivces.length;i++)
            {
                if(temp.servivces[i].title===serviceName){

                    // user.servivces.remove(user.servivces[i]);
                    temp.servivces.splice(i,1);

                    break;
                }


            }
            console.log(temp);

            $http({
                method: "PUT",
                url: '/v1/users/'+useremailid,
                data:temp
            }).success(function (data) {

            }).error(function (error) {

                $scope.unexpected_error = false;
                $scope.invalid_login = true;
                // $window.alert("unexpected_error");
            });




        };










    });




function PagerService() {
    // service definition
    var service = {};

    service.GetPager = GetPager;

    return service;

    // service implementation
    function GetPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 2;

        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);

        var startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        var pages = _.range(startPage, endPage + 1);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
}