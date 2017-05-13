/**
 * Created by amitpandey on 5/10/17.
 */
     angular.module("myApp", [])
    .factory('PagerService', PagerService)
    .controller('ExampleController', function($scope,$http,$window,PagerService) {




        $scope.username=sessionStorage.getItem('username');


        // var vm = this;



        $http({
             method: "GET",
             url: '/v1/jobs',
             data: {}
         }).success(function (data) {
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



        }).error(function (error) {
             console.log("inside error");
             console.log(error);
             $scope.unexpected_error = false;
             $scope.invalid_login = true;
             // $window.alert("unexpected_error");
         });


         $scope.jobPost =function () {

             var postedby="590f5eb7ec96bf2b5cdd3421";
             var postedbydetails = {
                 "_id": "590f5eb7ec96bf2b5cdd3421",
                 "username": sessionStorage.getItem('username'),
                 "user_emailid": sessionStorage.getItem('email'),
                 "user_password": "xxxxxxxxxx",
                 "user_profilepicture_url": sessionStorage.getItem('imageSrc'),
                 "user_degree": "masters",
                 "user_major": "IE",
             };


             $http({
                 method : "POST",
                 url : '/v1/jobs',
                 data : {
                     type:$scope.type,
                     title:$scope.title,
                     description:$scope.description,
                     location:$scope.location,
                     email:$scope.email,
                     url:$scope.url,
                     dateposted:$scope.dateposted,
                     department:$scope.department,
                     payrate:$scope.payrate,
                     postedby: postedby,
                     postedbydetails:postedbydetails


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

                 // sleep(2)
                 //
                 // function sleep(seconds)
                 // {
                 //     var e = new Date().getTime() + (seconds * 1000);
                 //     while (new Date().getTime() <= e) {}
                 //
                 // }
                 // window.location.assign("/profilefeed");



             }).error(function(error) {
                 console.log("inside error");
                 console.log(error);
                 $scope.unexpected_error = false;
                 $scope.invalid_login = true;
                 // $window.alert("unexpected_error");
             });

         }


         $scope.logout=function() {
             sessionStorage.clear("username");
             sessionStorage.clear("email");
             sessionStorage.clear("password");
             window.location.assign("/index");
         }



        $scope.profile=function() {
            window.location.assign("/profileCompletion");
        }

        $scope.SpartaEvents=function() {
            window.location.assign("/SpartaEvents");
        }

        $scope.SpartaJob=function() {
            window.location.assign("/profilefeed");
        }
        $scope.accomodation=function() {
            window.location.assign("/accomodation");
        }


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
        pageSize = pageSize || 4;

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
