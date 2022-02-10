model_status = "";
input = "";
objects = [];
object_identified = "";

function setup() {
    canvas = createCanvas(415, 315)
    canvas.center()
    video = createCapture(VIDEO)
    video.size(415, 315)
    video.hide()
}

function start() {
    objectsDetected = ml5.objectDetector('cocossd', modelLoaded)
    document.getElementById("status").innerHTML = "Status: Detecting Objects";
    input = document.getElementById("input").value
}

function modelLoaded() {
    console.log("Model Loaded")
    model_status = true
}

function draw() {
    image(video, 0, 0, 415, 315)
    if (model_status != "") {
        objectsDetected.detect(video, gotResults)
        for (i = 0; i < objects.length; i++) {
            document.getElementById("status").innerHTML = "Status: Objects Detected"
            fill("red")
            percent = Math.floor(objects[i].confidence * 100)
            text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15)
            noFill()
            stroke("red")
            rect(objects[i].x, objects[i].y, objects[0].width, objects[0].height)
            if (objects[i].label == input) {
                document.getElementById("objects").innerHTML = input + " found."
                video.stop()
                objectsDetected.detect(gotResults)
                if (objects[i].label != object_identified) {
                    var synth = window.speechSynthesis
                    var command = input + " found"
                    var utter_this = new SpeechSynthesisUtterance(command)
                    synth.speak(utter_this)
                }
                object_identified = objects[i].label
            } else {
                document.getElementById("objects").innerHTML = input + " not found."
            }
        }
    }
}

function gotResults(error, results) {
    if (error) {
        console.error(error)
    } else {
        console.log(results)
        objects = results
    }
}