var fs = require('fs');
var request = require('request');

/* Express Code */
var express = require('express')
var app = express()

app.use(express.static('.'))
app.listen(3000, function () {
  console.log('Started Listening on Port 3000')
});

/* Socket.io code */
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket) {
    socket.on('get_schedule', function() {
        socket.emit({"semesters": semesters});
    });
});
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

function verifyGroups(classes) {
    var groupCount = {};

    if(classes.length != major.choices.pick) {
        return false;
    }

    for(var i = 0; i < classes.length; i++) {
        for(var group in major.choices.groups) {
            if(major.choices.groups[group].indexOf(classes[i]) != -1) {
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

//TODO: This is broken. Rewrite to fit new gened format
function checkRequirements(classes) {
    /*var remaining = geneds.requirements;

    for(var i = 0; i < classes.length; i++) {
        for(var key in classes[i].gen_eds) {
            if(remaining.indexOf(classes[i].gen_eds[key]) != -1) {
                remianing.splice(remaining.indexOf(classes[i].gen_eds[key]), 1);
            }
        }
    }
    return remaining.length == 0;*/
    return false;
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
    "CMSC": JSON.parse(fs.readFileSync('majors/CMSC.json', 'utf8'))
}

var reqs = {};

for(var key in majors["CMSC"].requirements) {
    if(majors["CMSC"].requirements.hasOwnProperty(key)) {
        if(!majors["CMSC"].requirements[key].generic) {
            courses[majors["CMSC"].requirements[key].name] = (new Course(majors["CMSC"].requirements[key]));
        }
    }
}
reqs["CMSC"] = loadToClasses(majors["CMSC"].requirements, true);
for(var key in reqs["CMSC"]) {
    if(reqs["CMSC"].hasOwnProperty(key)) {
        addEarliest(reqs["CMSC"][key]);
    }
}
insertPlaceholders();
console.log(semesters);
