function getJSON(file, callback) {
    $.getJSON(file, function(data) {
        console.log(data);
        callback(data);
    });
}

/* Courses */
class Course {
    constructor(json) {
        this.ids = json.name;
        this.prereqs = json.prereqs;
        this.credits = json.credits;
        this.generic = json.generic;
    }

    compare(other) {
        for(var i = 0; i < this.ids.length; i++) {
            if(other.ids.indexOf(this.ids[i]) != -1) {
                return true;
            }
        }
        return false;
    }

    getFullPrereqs() {
        var full = this.prereqs;
        for(var i = 0; i < this.prereqs.length; i++) {
            full = full.concat(courses[full[i]].getFullPrereqs());
        }
        return full.filter(function(item, pos) {
            return full.indexOf(item) == pos;
        });
    }

    toString() {
        return this.ids[0];
    }
}

function loadToClasses(json, loadGeneric) {
    var ret = [];
    for(var key in json) {
        if(json.hasOwnProperty(key)) {
            if(!json[key].generic || loadGeneric) {
                ret.push(new Course(majors["CMSC"].requirements[key]));
            }
        }
    }
    return ret;
}

//var geneds = getJSON("https://evanmcintire.com/gradu8/majors/GE.json");
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

function queryClass(name, callback) {
    request('http://api.umd.io/v0/courses/' + name, function(error, response, body) {
        callback(body);
    });
}

function canTakeInSemester(course, semester) {
    var classes = [];
    for(var i = 0; i < semester; i++) {
        classes = classes.concat(semesters[i].courses);
    }

    var reqs = course.getFullPrereqs();
    var ids = getIds(classes);
    reqs = reqs.filter(function(item) {
        for(var i = 0; i < courses[item].ids.length; i++) {
            if(ids.indexOf(courses[item].ids[i]) != -1) {
                return false
            }
        }

        return true;
    });
    return reqs.length == 0;
}

function getIds(classes) {
    var ids = [];
    for(var i = 0; i < classes.length; i++) {
        for(var j = 0; j < classes[i].ids.length; j++) {
            ids.push(classes[i].ids[j]);
        }
    }
    return ids;
}

//returns false if it couldnt
function addEarliest(course) {
    for(var i = 0; i < 8; i++) {
        if(canTakeInSemester(course, i) && checkAmounts(course, semesters[i])) {
            semesters[i].courses.push(course);
            semesters[i].credits += course.credits;
            return true;
        }
    }
    return false;
}

function checkAmounts(course, semester) {
    if(majors["CMSC"].rules[course.ids[0]] == {}) {
        return true;
    }
    var count = 0;
    for(var i = 0; i < semester.courses.length; i++) {
        if(course.compare(semester.courses[i])) {
            count++;
            if(count >= majors["CMSC"].rules[course.ids[0]]) {
                return false;
            }
        }
    }
    return true;
}

function verifyGroups(ids) {
    var groupCount = {};

    if(ids.length != majors["CMSC"].choices.pick) {
        return false;
    }
    var groups = majors["CMSC"].choices.groups;
    for(var i = 0; i < ids.length; i++) {
        for(var group in groups) {
            if(groups[group].indexOf(ids[i]) != -1) {
                if(groupCount[groups.indexOf(groups[group])] == undefined) {
                    groupCount[groups.indexOf(groups[group])] = 1;
                } else {
                    groupCount[groups.indexOf(groups[group])]++;
                }
            }
        }
    }
    var size = 0;
    //We have all the counts, check if it's valid
    for(var key in groupCount) {
        if(groupCount.hasOwnProperty(key)) {
            size++;
            if(groupCount[key] > majors["CMSC"].choices.max_per_group) {
                return false;
            }

        }
    }
    if(size < majors["CMSC"].choices.min_groups) {
        return false;
    }
    if(size > majors["CMSC"].choices.max_groups && majors["CMSC"].choices.max_groups != -1) {
        return false;
    }
    return true;
}

function checkRequirements(classes) {
    var remaining = geneds.requirements;

    for(var i = 0; i < classes.length; i++) {
        for(var key in classes[i].gen_eds) {
            if(remaining.indexOf(classes[i].gen_eds[key]) != -1) {
                remianing.splice(remaining.indexOf(classes[i].gen_eds[key]), 1);
            }
        }
    }
    return remaining.length == 0;
}

function insertPlaceholders() {
    for(var i = 0; i < 8; i++) {
        while(semesters[i].credits < 14) {
            semesters[i].courses.push(new Course({ids:"Placeholder", credits:3, prereqs:[], generic:true}));
            semesters[i].credits += 3;
        }
    }
}

var courses = {};
var majors = {
    "CMSC": JSON.parse('{ "requirements": [ { "name": ["MATH140"], "prereqs": [], "credits": 4, "generic": false }, { "name": ["CMSC131"], "prereqs": [], "credits": 4, "generic": false }, { "name": ["MATH141"], "prereqs": ["MATH140"], "credits": 4, "generic": false }, { "name": ["CMSC132"], "prereqs": ["CMSC131", "MATH140"], "credits": 4, "generic": false }, { "name": ["CMSC216"], "prereqs": ["CMSC132", "MATH141"], "credits": 4, "generic": false }, { "name": ["CMSC250"], "prereqs": ["CMSC132", "MATH141"], "credits": 4, "generic": false }, { "name": ["CMSC330"], "prereqs": ["CMSC216", "CMSC250"], "credits": 3, "generic": false }, { "name": ["CMSC351"], "prereqs": ["CMSC216", "CMSC250"], "credits": 3, "generic": false }, { "name": ["STAT4XX"], "prereqs": ["MATH141"], "credits": 3, "generic": true }, { "name": ["STAT4XX", "MATHXXX"], "prereqs": ["MATH141"], "credits": 3, "generic": true }, { "name": ["CMSC4XX"], "prereqs": ["CMSC330", "CMSC351"], "credits": 3, "generic": true }, { "name": ["CMSC4XX"], "prereqs": ["CMSC330", "CMSC351"], "credits": 3, "generic": true }, { "name": ["CMSC4XX"], "prereqs": ["CMSC330", "CMSC351"], "credits": 3, "generic": true }, { "name": ["CMSC4XX"], "prereqs": ["CMSC330", "CMSC351"], "credits": 3, "generic": true }, { "name": ["CMSC4XX"], "prereqs": ["CMSC330", "CMSC351"], "credits": 3, "generic": true }, { "name": ["CMSC4XX"], "prereqs": ["CMSC330", "CMSC351"], "credits": 3, "generic": true }, { "name": ["CMSC4XX"], "prereqs": ["CMSC330", "CMSC351"], "credits": 3, "generic": true } ], "choices": { "pick": 7, "min_groups": 3, "max_groups": -1, "max_per_group": 4, "groups": [ [ "CMSC411", "CMSC412", "CMSC414", "CMSC417" ], [ "CMSC420", "CMSC421", "CMSC422", "CMSC423", "CMSC424", "CMSC426", "CMSC427" ], [ "CMSC430", "CMSC433", "CMSC434", "CMSC435", "CMSC436" ], [ "CMSC451", "CMSC452", "CMSC456" ], [ "CMSC460", "CMSC466" ] ] }, "rules": { "CMSC4XX": 2, "STAT4XX": 1 }}')
    /*getJSON("https://evanmcintire.com/gradu8/majors/CMSC.json", function(data) {
        fufillMajor("CMSC");
        console.log(semesters);
    })*///,
    //"MATH": getJSON("https://evanmcintire.com/gradu8/majors/MATH.json")
}

var reqs = {};
//console.log(majors["CMSC"]);
for(var key in majors["CMSC"].requirements) {
    if(majors["CMSC"].requirements.hasOwnProperty(key)) {
        if(!majors["CMSC"].requirements[key].generic) {
            courses[majors["CMSC"].requirements[key].name] = (new Course(majors["CMSC"].requirements[key]));
        }
    }
}

/*for(var key in majors["MATH"].requirements) {
    if(majors["MATH"].requirements.hasOwnProperty(key)) {
        if(!majors["MATH"].requirements[key].generic) {
            courses[majors["MATH"].requirements[key].name] = (new Course(majors["MATH"].requirements[key]));
        }
    }
}*/

reqs["CMSC"] = loadToClasses(majors["CMSC"].requirements, true);
//reqs["MATH"] = loadToClasses(majors["MATH"].requirements, true);


function fufillMajor(major) {
    for(var key in reqs[major]) {
        if(reqs[major].hasOwnProperty(key)) {
            addEarliest(reqs[major][key]);
        }
    }
    insertPlaceholders();
}

fufillMajor("CMSC");

console.log(semesters);