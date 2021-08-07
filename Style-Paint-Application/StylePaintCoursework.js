let handpose;
let detections = [];

let canvas;
let video;
let clearedCanvas = false;
let myImage;
let circleMask;

let x1 = 7,
    x2 = 17,
    y1 = 8,
    y2 = 18; //position of our finger

let increaseBrush;
let opacityControl;
let opacitySliderName;
let brushSliderName;
let brushSlider;
let styleSliderName;
let styleSlider;
let opacitySlider;
let styleValue;
let blendSlider;
let blendName;
let blendValue;

let instructionsBlend;
let instructionsStyle;
let generalInstructions;
let clearCanvasBut;
let saveCanvasBut;


function setup() {

    //Canvas and Graphics
    canvas = createCanvas(640, 480, WEBGL); 
    canvas.id("canvas");
    circleMask = createGraphics(128, 128);


    //video
    video = createCapture(VIDEO);
    video.id("video");
    video.size(640, 480);


    //styles
    style1 = ml5.styleTransfer("models/mathura");
    style2 = ml5.styleTransfer("models/udnie");
    style3 = ml5.styleTransfer("models/OversoulSpellModel");
    style4 = ml5.styleTransfer("models/OilPainting");



    SlidersAndButtons();
    
    //HandPose
    const options = {
        flipHorizontal: true, // boolean value for if the video should be flipped, defaults to false
        maxContinuousChecks: Infinity, // bounding box detection 
        detectionConfidence: .9, 
        scoreThreshold: 0.75, // remove duplicates
        iouThreshold: 0.3, // check if boxes overlap and if they are discard
    }

    handpose = ml5.handpose(video, options, modelReady);
    //w colorMode(HSB);
}

function modelReady() {
    console.log("Model ready!");
    handpose.on('predict', results => {
        detections = results;

    });
}



function draw() {
    tint(255, opacityControl);
    styleChange();
    Opacityfunc();
    BlendTypes();
    BrushSize();
    DrawHandPoints();
}


function SlidersAndButtons() { //Sliders and buttons for controlling all aspects of the sketch
    //button for canvas
    clearCanvasBut = createButton('Clear Canvas');
    clearCanvasBut.position(340 + 340);
    clearCanvasBut.mousePressed(Clear);


    //save func not working due to only saving canvas without video
    /*
    saveCanvasBut= createButton('Save Canvas');
     saveCanvasBut.position(390 + 390);
    saveCanvasBut.mousePressed(Saving);
    */
    //opacity slider
    opacitySlider = createSlider(0, 255, 140);
    opacitySlider.position(340 + 340, 60);
    opacitySlider.style('width', '80px');
    opacitySliderName = createElement('h4', 'Opacity Intensity ');
    opacitySliderName.position(340 + 340, 25);

    //Slider for brush
    brushSlider = createSlider(-70, 255, 100);
    brushSlider.position(340 + 340, 100);
    brushSlider.style('width', '80px');
    brushSliderName = createElement('h4', 'Brush Size ');
    brushSliderName.position(340 + 340, 65);

    //slider for style cahnge
    styleSlider = createSlider(0, 4, 0);
    styleSlider.position(340 + 340, 155);
    styleSlider.style('width', '80px');
    styleSliderName = createElement('h4', 'Change Style ');
    styleSliderName.position(340 + 340, 115);

    instructionsStyle = createElement('P4', '1:Mathura  2:Udnie  3:Oversoul  4:OilPainting ');
    instructionsStyle.position(390 + 390, 155);

    //slider for style cahnge
    blendSlider = createSlider(0, 4, 0);
    blendSlider.position(340 + 340, 205);
    blendSlider.style('width', '80px');
    blendSliderName = createElement('h4', 'Change BlendType ');
    blendSliderName.position(340 + 340, 165);

    instructionsBlend = createElement('P4', '1:Add  2:Lightest  3:Darkest  4:Screen');
    instructionsBlend.position(390 + 390, 205);

    generalInstructions = createElement('H3', 'Select a stlye and move finger to begin painting');
    generalInstructions.position(390 + 390, 300);
}

function DrawHandPoints() {
    translate(-width / 2, -height / 2);
    if (detections.length > 0) {
        drawLines([x1, y1]);

    }
}

function BrushSize() {
    increaseBrush = brushSlider.value();
}

function Opacityfunc() {
    opacityControl = opacitySlider.value();

}

function styleChange() {
    styleValue = styleSlider.value();

}

function BlendChange() {

    blendValue = blendSlider.value();


}

function BlendTypes() {
    BlendChange();
    switch (blendValue) {
        case 0:
            blendMode(BLEND);
            break;
        case 1:
            blendMode(ADD);
            break;
        case 2:
            blendMode(LIGHTEST);
            break;
        case 3:
            blendMode(DARKEST);
            break;
        case 4:
            blendMode(SCREEN);
            break;
    }

}

function Clear() {

    clear();

}

function Saving() {//not working, does not save video with canvas changes
    saveCanvas('myCanvas', 'jpg');
}



function drawLandmarks(indexArray, hue) { //creating our hand points from which we draw from
    for (let i = 0; i < detections.length; i++) {
        for (let j = indexArray[0]; j < indexArray[1]; j++) {
            let x = detections[i].landmarks[j][0];
            let y = detections[i].landmarks[j][1];
            let z = detections[i].landmarks[j][2];
            //stroke(hue, 40, 255);
            point(x, y);
        }
    }
}

function drawLines(index) { //draw line function , we take in each coordinate of our detection array and draw a line according to x,y,z //we want to enable a boolean on one of the detections

    //stroke(0, 0, 255);
    //strokeWeight(10);
    for (let i = 0; i < detections.length; i++) {
        for (let j = 0; j < index.length - 1; j++) {
            let x = detections[i].landmarks[index[j]][0];
            let y = detections[i].landmarks[index[j]][1];
            let z = detections[i].landmarks[index[j]][2];

            let _x = detections[i].landmarks[index[j + 1]][0];
            let _y = detections[i].landmarks[index[j + 1]][1];
            let _z = detections[i].landmarks[index[j + 1]][2];
            let d = dist(x, y, _x, _y);


            if (styleValue == 1) {


                style1.transfer(canvas, function (err, result) {

                    tempDOMImage = createImg(result.src).hide();

                    myImage = tempDOMImage;
                    image(myImage, x - 30, y - 60, 100 + increaseBrush, 100 + increaseBrush);

                });

            } else if (styleValue == 2) {


                style2.transfer(canvas, function (err, result) {
                    tempDOMImage = createImg(result.src).hide();

                    myImage = tempDOMImage;
                    image(myImage, x - 30, y - 60, 100 + increaseBrush, 100 + increaseBrush);
                });
            } else if (styleValue == 3) {


                style3.transfer(canvas, function (err, result) {
                    tempDOMImage = createImg(result.src).hide();
                    myImage = tempDOMImage;
                    image(myImage, x - 30, y - 60, 100 + increaseBrush, 100 + increaseBrush);
                });
            } else if (styleValue == 4) {


                style4.transfer(canvas, function (err, result) {
                    tempDOMImage = createImg(result.src).hide();
                    myImage = tempDOMImage;
                    image(myImage, x - 30, y - 60, 100 + increaseBrush, 100 + increaseBrush);
                });

                point(x, y);

            }
        }
    }
}
