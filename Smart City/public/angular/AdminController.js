/**
 * Created by amitpandey on 5/10/17.
 */
var myApp=angular.module("myApp", [])
myApp.controller("AdminCtrl", function($scope,$http,$window) {


    $http({
        method: "GET",
        url: '/v1/analytics/postcounts',
        data: {}
    }).success(function (data) {
        // $scope.postcounts = data;
        drawcircle(data);

    }).error(function (error) {
        console.log("inside error");
        console.log(error);
        $scope.unexpected_error = false;
        $scope.invalid_login = true;
        // $window.alert("unexpected_error");
    });



    function drawcircle(data){
        var v1 = data['events'];
        var v2 = data['jobs'];
        var v3 = data['accomodations'];
        Highcharts.chart('containerSemiCircle', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false
            },
            title: {
                text: "Post per User",
                align: 'center',
                verticalAlign: 'middle',
                y: 40
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: true,
                        distance: -50,
                        style: {
                            fontWeight: 'bold',
                            color: 'white'
                        }
                    },
                    startAngle: -90,
                    endAngle: 90,
                    center: ['50%', '75%']
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                innerSize: '50%',
                data: [
                    ['Jobs',   v1],
                    ['Events',       v2],
                    ['Accomodations', v3],
                    {
                        name: 'Proprietary or Undetectable',
                        y: 0.2,
                        dataLabels: {
                            enabled: false
                        }
                    }
                ]
            }]
        });
    }




    $http({
        method: "GET",
        url: '/v1/analytics/majorcounts',
        data: {}
    }).success(function (data) {
        console.log(data);
        makePieChart(data);
    }).error(function (error) {
        console.log("inside error");
        console.log(error);
        $scope.unexpected_error = false;
        $scope.invalid_login = true;
        // $window.alert("unexpected_error");
    });



    function makePieChart(data)
    {
        console.log("I am in pie chart");
        var v1 = data['CS'];
        var v2 = data['SE'];
        var v3 = data['CE'];
        var v4 = data['EE'];
        var v5 = data['IE'];


        // Build the chart
        Highcharts.chart('containerPieChart', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Number of Users per Major'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: [{
                    name: 'Computer Science',
                    y: v1
                }, {
                    name: 'Software Engineering',
                    y: v2,
                    sliced: true,
                    selected: true
                }, {
                    name: 'Computer Engineering',
                    y: v3
                }, {
                    name: 'Electrical & Electronics Engineering',
                    y: v4
                }, {
                    name: 'Industrial Engineering',
                    y: v5
                }]
            }]
        });
    };


    $scope.logout=function() {
        window.location.assign("/index");
    }

});
