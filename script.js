var tooltipMap = {
    "Major": "Major Requirement",
    "AR": "Analytical Reasoning",
    "MA": "Math"
}

function addCourse(course) {
    var dispName = course.ids.join("/");
    var fufills = ["Major", "AR", "MA"]
    var chips = $('<div>').addClass('chips-holder');
    if(!course.generic) {
        for(var i = 0; i < fufills.length; i++) {
            chips.append(
            $("<div>")
                .addClass('chip tooltipped grey')
                .attr("data-position", "bottom")
                .attr("data-delay", "30")
                .attr("data-tooltip", tooltipMap[fufills[i]])
                .html(fufills[i])
            );
        }
    } else {
        chips.append($('<a>').addClass("waves-effect waves-light btn red").attr('href', '#class-picker').html("Pick Class"));
    }

    var course = $('<li>').append(
        $('<div>').addClass('collapsible-header grey lighten-3')
                  .html(dispName).append(chips)
    ).append(
        $('<div>').addClass('collapsible-body')
                  .html("Description")
    ).addClass('course').appendTo("#year1-courses");

    $('.collapsible').collapsible();
}

var testCourse = new Course({
    "name": ["CMSC4XX"],
    "prereqs": [],
    "credits": 3,
    "generic": true
});

var testCourse2 = new Course({
    "name": ["MATH141"],
    "prereqs": [],
    "credits": 4,
    "generic": false
});

$(document).ready(function(){
    $('ul.tabs').tabs();
    $('.collapsible').collapsible();
    addCourse(testCourse);
    addCourse(testCourse2);
    $('.chips-initial').material_chip('data');
    $('.tooltipped').tooltip({delay: 50});
    $('.modal').modal();

    fufillMajor("CMSC");
    console.log(semesters);
});