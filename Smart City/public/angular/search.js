function myFunction() {
    var input = document.getElementById("searchValue").value.toUpperCase();
    var feeds = document.getElementsByClassName("feedSearch");

    for (var i = 0; i < feeds.length; i++) {

        feeds[i].style.display ="block";

        var username = feeds[i].getElementsByClassName("username")[0].innerHTML;
        var dateposted = feeds[i].getElementsByClassName("dateposted")[0].innerHTML;
        var description = feeds[i].getElementsByClassName("description")[0].innerHTML;
        var location = feeds[i].getElementsByClassName("location")[0].innerHTML;
        var type = feeds[i].getElementsByClassName("type")[0].innerHTML;

        if(username.toUpperCase().indexOf(input) > -1 ||
            dateposted.toUpperCase().indexOf(input) > -1 ||
            type.toUpperCase().indexOf(input) > -1 ||
            description.toUpperCase().indexOf(input) > -1 ||
            location.toUpperCase().indexOf(input) > -1 ){

        }
        else{

            feeds[i].style.display ="none";
        }


    }
}