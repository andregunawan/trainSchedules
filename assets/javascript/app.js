// Declared Variabel
var trainName = " ";
var trainDestination = " ";
var trainTime = " ";
var trainFrequency = " ";
var nextArrival = " ";
var minutesAway = " ";
var newTrain = $("#train-name");
var newTrainDestination = $("#train-destination");
var newTrainTime = $("#train-time").mask("00:00");
var newTrainFreq = $("#time-freq").mask("00");


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCRYl6XS0dvaGYaD64EYY_sFqAgmT9QsIg",
    authDomain: "train-schedule-177f1.firebaseapp.com",
    databaseURL: "https://train-schedule-177f1.firebaseio.com",
    projectId: "train-schedule-177f1",
    storageBucket: "train-schedule-177f1.appspot.com",
    messagingSenderId: "243059268123"
};

firebase.initializeApp(config);

var database = firebase.database();

database.ref("/trains").on("child_added", function(snapshot) {

    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesAway = " ";
    var nextTrainTime = " ";
    var frequency = snapshot.val().frequency;

    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");
    trainRemainder = trainDiff % frequency;
    minutesAway = frequency - trainRemainder;
    nextTrainTime = moment().add(minutesAway, "m").format("hh:mm A");

    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td>" +
        "<td class='minsAway'>" + minutesAway + "</td>" + 
        "<td><button type='button' id='edit-btn' class='btn btn-primary'>" + "Edit" + "</button></td>" +
        "<td><button type='button' id='edit-btn' class='btn btn-primary'>" + "Remove" + "</button></td></tr>"
    );

});

var storeInputs = function(event) {

    event.preventDefault();

    trainName = newTrain.val().trim();
    trainDestination = newTrainDestination.val().trim();
    trainTime = moment(newTrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = newTrainFreq.val().trim();

    database.ref("/trains").push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    newTrain.val("");
    newTrainDestination.val("");
    newTrainTime.val("");
    newTrainFreq.val("");
};


$(document).ready(function() 
{

// setInterval(function(){
//     $('.minsAway').html(moment().format('hh:mm:ss A'))
//   }, 1000);

$("#btn-add").on("click", function(event) {

    if (newTrain.val().length === 0 || newTrainDestination.val().length === 0 || newTrainTime.val().length === 0 || newTrainFreq === 0) {
        alert("Please Fill All Required Fields");
    } else {
        storeInputs(event);
    }
});

$('form').on("keypress", function(event) {
    if (event.which === 13) {
        if (newTrain.val().length === 0 || newTrainDestination.val().length === 0 || newTrainTime.val().length === 0 || newTrainFreq === 0) {
            alert("Please Fill All Required Fields");
        } else {
            storeInputs(event);
        }
    }
});

$("#remove-btn").on("click", function(event) {
    var removeTrain = $(event.target).remove();

    console.log(removeTrain);

});

});