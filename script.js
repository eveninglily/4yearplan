var tooltipMap = {
    "Major": "Major Requirement",
    "AR": "Analytical Reasoning",
    "FSAR": "Analytical Reasoning",
    "FSMA": "Math",
    "FSAW":"Academic Writing",
    "FSPW": "Professional Writing",
    "FSOC": "Oral Communication",
    "DSNL": "Natural Lab",
    "DSNS": "Natural Science",
    "DSHS": "History",
    "DSHU": "Humanities",
    "DSSP": "Scholarship in Practice",
    "SCIS": "I-Series",
    "DVUP": "Understanding Plural Societies",
    "DVCC": "Cultural Competency"
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

var geneds2 = {
    "AW": [
        "ENGL101"
    ],
    "AR": [
        "BIOM301",
        "BGMT230",
        "CCJS200",
        "EDHD306",
        "GEOG306",
        "MATH140",
        "PHIL170"
    ],
    "MA": [
        "MATH107",
        "MATH113",
        "MATH115",
        "MATH120",
        "MATH140",
        "STAT100"
    ],
    "OC": [
        "COMM107",
        "INAG100",
        "JOUR130",
        "THET285",
        "HLTH420"
    ],
    "PW": [
        "ENGL390",
        "ENGL391",
        "ENGL392",
        "ENGL393",
        "ENGL394",
    ],
    "HS": [
        "AASP100",
        "AMST202",
        "ANTH240",
        "AREC240",
        "CCJS100",
        "ECON111"
    ],
    "HU": [
        "CLAS170",
        "CMLT235",
        "ENEE200",
        "ENGL211",
        "HIST319K"
    ],
    "NS": [
        "ANSC227",
        "ASTR100",
        "BSCI160",
        "GEOG140"
    ],
    "NL": [
        "ANTH222",
        "BSCI170",
        "CHEM131",
        "PHYS115",
        "PLSC101"
    ],
    "SP": [
        "ENGL293",
        "ENSP400",
        "FIRE257",
        "GEMS202",
        "HDCC208B",
        "HIST408P"
    ],
    "CC": [
        "AAST498M",
        "BSST335",
        "COMM382",
        "EDSP220",
        "ENES472"
    ],
    "UP": [
        "AASP100",
        "AAST200",
        "AMST101",
        "ANTH222",
        "ARTH200",
        "ENGL134",
        "HIST111",
        "HIST289Y"
    ],
    "IS": [
        "AASP187",
        "AMST260",
        "ANSC227",
        "AOSC123",
        "ARCH270",
        "BSCI283",
        "CCJS225",
        "CPSS225"
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

function generateGenEdModalContent() {
    $('#gened-pick-list').empty();
    for(var key in geneds2) {
        if(geneds2.hasOwnProperty(key)) {
            if($('#' + key.toLowerCase() + '-check').is(":checked")) {
                for(var i = 0; i < geneds2[key].length; i++) {
                    getCourseData(geneds2[key][i], function(data) {
                    var elem = $('<div>');
                    var holder = $('<div>').addClass('chips-holder');
                    for(var i = 0; i < data.gen_ed.length; i++) {
                        holder.append(
                        $("<div>")
                            .addClass('chip tooltipped')
                            .attr("data-position", "bottom")
                            .attr("data-delay", "30")
                            .attr("data-tooltip", tooltipMap[data.gen_ed[i]])
                            .html(data.gen_ed[i])
                        );

                    }

                    elem.append(
                        $('<h6>').html(data.course_id + " - " + data.name).append(holder)
                    ).append(
                        $('<p>').html(data.description)
                    )
                    var newElement = $('<li>')
                                    .addClass('collection-item modal-class-choice')
                                    .html(elem)
                                    .appendTo('#gened-pick-list');
                            $('.tooltipped').tooltip({delay: 50});
                    })
                }
            }
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
        chips.append($('<a>').addClass("waves-effect waves-light btn red").attr('href', '#gened-picker').html("Pick Class"));
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

    generateModalContent(["CMSC4XX"]);

    $('#gened-picker input').on('change', function() {
        generateGenEdModalContent();
    });
});