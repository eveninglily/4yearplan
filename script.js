var tooltipMap = {
    "Major": "Major Requirement",
    "AR": "Analytical Reasoning",
    "MA": "Math"
}

function addCourse(course) {
    var dispName = course.ids.join("/");
    var fufills = ["Major", "AR", "MA"]
    var chips = $('<div>');
    for(var i = 0; i < fufills.length; i++) {
        chips.append(
        $("<div>")
            .addClass('chip tooltipped')
            .attr("data-position", "bottom")
            .attr("data-delay", "30")
            .attr("data-tooltip", tooltipMap[fufills[i]])
            .html(fufills[i])
        ).addClass('chips-holder');
    }

    var course = $('<li>').append(
        $('<div>').addClass('collapsible-header')
                  .html(dispName).append(chips)
    ).append(
        $('<div>').addClass('collapsible-body')
                  .html("Description")
    ).appendTo("#year1-courses");
    $('.collapsible').collapsible({
        accordion: false
    });
}

var testCourse = new Course({
    "name": ["MATH140"],
    "prereqs": [],
    "credits": 4,
    "generic": false
});

$(document).ready(function(){
    $('ul.tabs').tabs();
    $('.collapsible').collapsible({
        accordion: false
    });
    addCourse(testCourse);
    $('.chips-initial').material_chip('data');
    $('.tooltipped').tooltip({delay: 50});
});