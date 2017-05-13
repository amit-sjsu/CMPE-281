/**
 * Created by amitpandey on 5/10/17.
 */
angular.module("myApp", [])
    .factory('PagerService', PagerService)
    .controller('AccomoController', function($scope,$http,$window,PagerService) {




        $scope.username=sessionStorage.getItem('username');




        function showPlaces(place){
            var data = document.getElementById(place);

            var opt = {
                types : ['address']
            };
            var lat, lon;
            autocomplete = new google.maps.places.Autocomplete(inp, opt);
            autocomplete.addListener('place_changed', function(){

                var crd = autocomplete.getPlace().geometry.location;
                lat = crd.lat();
                lon = crd.lng();
                localStorage.setItem("lat", lat);
                localStorage.setItem("lon", lon);
                console.log("Lat - " + lat + " Long - " + lon );
            });
        }



        function validate(){
            if(document.getElementById("tit").value == "" ||
                document.getElementById("type").value == "" ||
                document.getElementById("inp").value == "" ||
                document.getElementById("prefer").value == "" ||
                document.getElementById("date").value == "" ||
                document.getElementById("fac").value == "" ||
                document.getElementById("vacan").value == "" ||
                document.getElementById("con").value == "" ||
                document.getElementById("rent").value == "" ) {
                console.log("iinside if validate");
                return true;
            }
            else{
                addplace();
                return false;
            }
        }

        function addplace(){
            console.log("inside addplace");
            var newData = {};
            newData.type = document.getElementById("type").value;
            newData.vacancies = document.getElementById("vacan").value;
            newData.apartment = document.getElementById("tit").value;
            newData.address = document.getElementById("inp").value;
            newData.preference = document.getElementById("prefer").value;
            newData.startdate = document.getElementById("date").value;
            newData.facilities = document.getElementById("fac").value;
            newData.contact = document.getElementById("con").value;
            newData.rent = document.getElementById("rent").value;
            newData.lat = localStorage.getItem("lat");
            newData.lon = localStorage.getItem("lon");

            console.log(newData.type);
            console.log(newData.vacancies);
            console.log(newData.apartment);
            console.log(newData.address);
            console.log(newData.preference);
            console.log(newData.startdate);
            console.log(newData.facilities);
            console.log(newData.contact);
            console.log(newData.rent);
            console.log(newData.lat);
            console.log(newData.lon);

            // call post api
            // then page will reload
        }


        function initMap() {

            var data = sessionStorage.getItem("data");

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 11,
                center: {lat: 37.344717, lng: -121.979666}
            });
            var marker = "";

            for(var i=0;i<data.length;i++){
                var contentString =

                    '<h3>Details</h3>'+
                    '<b>Type</b>: ' + data[i].type + '</b> '+
                    '<b>Vacancies</b>: ' + data[i].vacancies + '</b><br>'+
                    '<b>Preference</b>: ' + data[i].preference + '</b>'+
                    '<b>Start Date</b>: ' + data[i].startdate + '</b><br>  '+
                    '<b>Facilities</b>: ' + data[i].facilities + '</b>  '+
                    '<b>Apartment</b>: ' + data[i].apartment + '</b> <br> '+
                    '<b>Address</b>: ' + data[i].address + '</b><br>   '+
                    '<b>Contact</b>: ' + data[i].contact + '</b><br>'+
                    '<b>Rent</b>: ' + data[i].rent + '</b>';

                var locat  = {lat: parseFloat(data[i].lattitude), lng: parseFloat(data[i].longitude)};
                console.log("type of "+typeof(data[i].lattitude));
                console.log('locat');


                marker = new google.maps.Marker({

                    position: locat,
                    animation: google.maps.Animation.DROP,
                    map: map
                });
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                marker.addListener('mouseover', function() {
                    infowindow.open(map, this);
                });
                marker.addListener('mouseout', function() {
                    infowindow.close(map, this);
                });
                marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
            }
        }














        // var vm = this;



        $http({
            method: "GET",
            url: '/v1/accomodations',
            data: {}
        }).success(function (data) {
            console.log(data);
            $scope.post = data;
            sessionStorage.setItem("data",data);
            console.log(sessionStorage.getItem("data"));


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


        $scope.accomodationPost =function () {

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
                url : '/v1/accomodations',
                data : {
                    type:$scope.type,
                    vacancies:$scope.vacancies,
                    preference:$scope.preference,
                    startdate:$scope.startdate,
                    facilities:$scope.facilities,
                    address:$scope.address,
                    apartments:$scope.apartments,
                    latitude:localStorage.getItem("lat"),
                    longitude:localStorage.getItem("lon"),
                    contact:$scope.contact,
                    rent:$scope.rent,
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
                    window.location.assign("/accomodation");
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
