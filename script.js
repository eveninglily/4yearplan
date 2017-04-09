var tooltipMap = {
    "Major": "Major Requirement",
    "AR": "Analytical Reasoning",
    "MA": "Math"
}

var courseMap = {
    "CMSC4XX": [
        "CMSC411",
        "CMSC412",
        "CMSC414",
        "CMSC417",
        "CMSC420",
        "CMSC421",
        "CMSC422",
        "CMSC423",
        "CMSC424",
        "CMSC426",
        "CMSC427",
        "CMSC430",
        "CMSC433",
        "CMSC434",
        "CMSC435",
        "CMSC436",
        "CMSC451",
        "CMSC452",
        "CMSC456",
        "CMSC460",
        "CMSC466"
    ]
}

function generateModalContent(courseIds) {
    console.log(courseIds);
    for(var i = 0; i < courseIds.length; i++) {
        console.log(i);
        for(var j = 0; j < courseMap[courseIds[i]].length; j++) {
            getCourseData(courseMap[courseIds[i]][j], function(data) {
                var elem = $('<div>');
                elem.append(
                    $('<h6>').html(data.course_id + " - " + data.name)
                ).append(
                    $('<p>').html(data.description)
                )
                var newElement = $('<li>')
                                .addClass('collection-item modal-class-choice')
                                .html(elem)
                                .appendTo('#class-pick-list');
                })

        }
    }
}

function getCourseData(id, callback) {
    $.getJSON('http://api.umd.io/v0/courses/' + id, function(data) {
        callback(data);
    })
}

getCourseData("CMSC420", function(data) {
    console.log(data);
})

function addCourse(course, semNum){
    var dispName = course.ids.join("/");
    var course = $('<li>').append(
        $('<div>').addClass('collapsible-header')
                  .html(dispName).append(chips)
    ).append(
        $('<div>').addClass('collapsible-body')
                  .html("Description")
    ).addClass('course').appendTo("#year1-courses");

    $('.collapsible').collapsible();
}

/*
function addCourse(course) {
    var dispName = course.ids.join("/");
    var fufills = ["Major", "AR", "MA"]
    var chips = $('<div>').addClass('chips-holder');
    if(!course.generic) {
        for(var i = 0; i < fufills.length; i++) {
            chips.append(
            $("<div>")
                .addClass('chip tooltipped')
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
        $('<div>').addClass('collapsible-header')
                  .html(dispName).append(chips)
    ).append(
        $('<div>').addClass('collapsible-body')
                  .html("Description")
    ).addClass('course').appendTo("#year1-courses");

    $('.collapsible').collapsible();
}
*/

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

function processSemesters(){
    for (var i = 0; i < semesters.length; i++){
        for (var j = 0; j < semester[i].courses.length; j++){
            addCourse(semester[i].courses[j].ids[0], i);
        }
    }
}



$(document).ready(function(){
    $('ul.tabs').tabs();
    $('.collapsible').collapsible();
    addCourse(testCourse);
    addCourse(testCourse2);
    $('.chips-initial').material_chip('data');
    $('.tooltipped').tooltip({delay: 50});
    $('.modal').modal();

    generateModalContent(["CMSC4XX"]);
});

