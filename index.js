var fs = require('fs');
var request = require('request');

var major = JSON.parse(fs.readFileSync('majors/compsci.json', 'utf8'));
var semesters = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
];

var requirements = major.requirements;

for(var key in requirements) {
    if(requirements.hasOwnProperty(key)) {
        //console.log(requirements[key]);
    }
}

function queryClass(name) {
    request('http://api.umd.io/v0/courses/' + name, function(error, response, body) {
        console.log('error: ' + error);
        console.log('statusCode: ', response && response.statusCode);
        console.log('body: ' + JSON.stringify(JSON.parse(body), null, 2));
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
        classes = classes.concat(semesters[i]);
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
            semesters[i].push(name);
            return true;
        }
    }
    return false;
}

function checkAmounts(name, semester) {
    var count = 0;
    for(var i = 0; i < semester.length; i++) {
        if(semester[i] == name) {
            count++;
            if(count >= major.rules[name]) {
                return false;
            }
        }
    }
    return true;
}

for(var key in requirements) {
    if(requirements.hasOwnProperty(key)) {
        //console.log(getFullPrereqs(requirements[key].name));
        console.log(addEarliest(requirements[key].name));
    }
}

//queryClass("CMSC216");
console.log(semesters);