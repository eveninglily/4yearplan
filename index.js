var fs = require('fs');
var request = require('request');

var major = JSON.parse(fs.readFileSync('majors/compsci.json', 'utf8'));
var geneds = JSON.parse(fs.readFileSync('majors/gened.json', 'utf8'));
var semesters = [
    { "courses":[], "credits": 0 },
    { "courses":[], "credits": 0 },
    { "courses":[], "credits": 0 },
    { "courses":[], "credits": 0 },
    { "courses":[], "credits": 0 },
    { "courses":[], "credits": 0 },
    { "courses":[], "credits": 0 },
    { "courses":[], "credits": 0 }
];

var requirements = major.requirements;

function queryClass(name, callback) {
    request('http://api.umd.io/v0/courses/' + name, function(error, response, body) {
        callback(body);
    });
}

function getFullPrereqs(name) {
    var full = [];
    var cl;
    for(var key in requirements) {
        if(requirements.hasOwnProperty(key)) {
            if(requirements[key].name == name) {
                cl = requirements[key];
                full = requirements[key].prereqs;
                for(var req in requirements[key].prereqs) {
                    if(requirements[key].prereqs.hasOwnProperty(req)) {
                        full = full.concat(getFullPrereqs(requirements[key].prereqs[req]));
                    }
                }
            }
        }
    }
    return full.filter(function(item, pos) {
        return full.indexOf(item) == pos;
    });
}

function canTakeInSemester(name, semester) {
    var classes = [];
    for(var i = 0; i < semester; i++) {
        classes = classes.concat(semesters[i].courses);
    }

    var reqs = getFullPrereqs(name);

    reqs = reqs.filter(function(item) {
        return classes.indexOf(item) == -1;
    });
    return reqs.length == 0;
}

//returns false if it couldnt
function addEarliest(name) {
    for(var i = 0; i < 8; i++) {
        if(canTakeInSemester(name, i) && checkAmounts(name, semesters[i])) {
            semesters[i].courses.push(name);
            semesters[i].credits += getCredits(name);
            return true;
        }
    }
    return false;
}

function checkAmounts(name, semester) {
    var count = 0;
    for(var i = 0; i < semester.courses.length; i++) {
        if(semester.courses[i] == name) {
            count++;
            if(count >= major.rules[name]) {
                return false;
            }
        }
    }
    return true;
}

function getCredits(name) {
    for(var key in requirements) {
        if(requirements.hasOwnProperty(key)) {
            if(requirements[key].name == name) {
                return requirements[key].credits;
            }
        }
    }
    return 0;
}

function verifyGroups(classes) {
    var groupCount = {};

    if(classes.length != major.choices.pick) {
        return false;
    }

    for(var i = 0; i < classes.length; i++) {
        for(var group in major.choices.groups) {
            if(major.choices.groups[group].indexOf(classes[i]) != -1) {
                console.log();
                if(groupCount[major.choices.groups.indexOf(major.choices.groups[group])] == undefined) {
                    groupCount[major.choices.groups.indexOf(major.choices.groups[group])] = 1;
                } else {
                    groupCount[major.choices.groups.indexOf(major.choices.groups[group])]++;
                }
            }
        }
    }
    var size = 0;
    //We have all the counts, check if it's valid
    for(var key in groupCount) {
        if(groupCount.hasOwnProperty(key)) {
            size++;
            if(groupCount[key] > major.choices.max_per_group) {
                return false;
            }

        }
    }
    if(size < major.choices.min_groups) {
        return false;
    }
    if(size > major.choices.max_groups && major.choices.max_groups != -1) {
        return false;
    }
    return true;
}

for(var key in requirements) {
    if(requirements.hasOwnProperty(key)) {
        addEarliest(requirements[key].name);
    }
}

//queryClass("CMSC216");
console.log(semesters);
///console.log(verifyGroups(["CMSC411", "CMSC420", "CMSC412", "CMSC451", "CMSC460", "CMSC430", "CMSC433"]));
