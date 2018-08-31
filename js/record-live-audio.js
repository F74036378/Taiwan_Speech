// This example uses MediaRecorder to record from a live audio stream,
// and uses the resulting blob as a source for an audio element.
//
// The relevant functions in use are:
//
// navigator.mediaDevices.getUserMedia -> to get audio stream from microphone
// MediaRecorder (constructor) -> create MediaRecorder instance for a stream
// MediaRecorder.ondataavailable -> event to listen to when the recording is ready
// MediaRecorder.start -> start recording
// MediaRecorder.stop -> stop recording (this will generate a blob of data)
// URL.createObjectURL -> to create a URL from a blob, which we can use as audio src

var recordButton, stopButton, recorder;

function record_init() {
  
  recordButton = document.getElementById('record');
  stopButton = document.getElementById('stop');
  // get audio stream from user's mic
  navigator.mediaDevices.getUserMedia({
    audio: true
  })
  .then(function (stream) {
    recordButton.disabled = false;
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    recorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});
    //recorder = new MediaRecorder(stream);
//	console.dir(recorder.mimeType);
    // listen to dataavailable, which gets triggered whenever we have
    // an audio blob available
    recorder.addEventListener('dataavailable', onRecordingReady);
  });
};

function startRecording() {
  recordButton.disabled = true;
  stopButton.disabled = false;

  recorder.start();
}

function stopRecording() {
  recordButton.disabled = false;
  stopButton.disabled = true;
  // Stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
  recorder.stop();
}

function onRecordingReady(e) {
  var audio = document.getElementById('audio');
  // e.data contains a blob representing the recording
  audio.src = URL.createObjectURL(e.data);
  //audio.play();
  upload(e.data);
}

function upload(blob) {
    //document.getElementById("outputSentence").innerHTML=array.message;
    if ("WebSocket" in window){
        var ws = new WebSocket("wss://140.116.245.217:2802");
        ws.onopen = function()
        {
            // Web Socket 已连接上，使用 send() 方法发送数据
            ws.send(blob);
                  
        };
        ws.onmessage = function (evt) 
        { 
            var received_msg = evt.data;
            document.getElementById("outputSentence").innerHTML=received_msg;
        };
                
    }
    else{
        alert("您的瀏覽器不支持 WebSocket!");
    }
}

