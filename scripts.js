$(document).ready(function() {
    // Get references to elements
    const surpriseButton = $('#surpriseButton');
    const videoContainer = $('#videoContainer');
    const birthdayVideo = $('#birthdayVideo');
    const memoriesVideo = $('#memoriesVideo');
    const nextButton = $('#nextButton');
    const startOverButton = $('#startOverButton');
    const promptContainer = $('#promptContainer');
    const finalPromptContainer = $('#finalPromptContainer');
    const callButton = $('#callButton');
    const messageButton = $('#messageButton');
    const muteButton = $('#muteButton');
    const backgroundAudio1 = $('#backgroundAudio1').get(0);
    const backgroundAudio2 = $('#backgroundAudio2').get(0);
    const backgroundAudio3 = $('#backgroundAudio3').get(0);
    let mediaRecorder;
    let recordedChunks = [];
    let isMuted = false;

    // Ask for permissions upfront
    async function askPermissions() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = function(event) {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = function() {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'reaction_video.webm';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            };
        } catch (err) {
            console.error("Error capturing media", err);
        }
    }

    // Initialize permissions and audio
    askPermissions().then(() => {
        $('#loading').hide();
        $('#content').show();
        backgroundAudio1.play();
        updateGuideText("Welcome! Click the button below to start your surprise.");
    });

    // Function to handle media capture
    function startRecording() {
        if (mediaRecorder && mediaRecorder.state === 'inactive') {
            recordedChunks = [];
            mediaRecorder.start();
        }
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    }

    function playVideoFullScreen(videoElement) {
        if (videoElement.requestFullscreen) {
            videoElement.requestFullscreen();
        } else if (videoElement.mozRequestFullScreen) { // Firefox
            videoElement.mozRequestFullScreen();
        } else if (videoElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera
            videoElement.webkitRequestFullscreen();
        } else if (videoElement.msRequestFullscreen) { // IE/Edge
            videoElement.msRequestFullscreen();
        }
        videoElement.play();
    }

    function updateGuideText(text) {
        const guideText = $('#guideText');
        guideText.fadeOut(300, function() {
            guideText.text(text);
            guideText.fadeIn(300);
        });
    }

    // Button click handlers
    surpriseButton.on('click', function() {
        updateGuideText("Playing the first video. Enjoy!");
        surpriseButton.hide();
        videoContainer.show();
        birthdayVideo.show();
        playVideoFullScreen(birthdayVideo.get(0));
        startRecording();
        backgroundAudio1.pause();
    });

    birthdayVideo.on('ended', function() {
        updateGuideText("Click 'Watch Memories Video' for more!");
        birthdayVideo.hide();
        promptContainer.show();
        backgroundAudio2.play();
    });

    nextButton.on('click', function() {
        updateGuideText("Playing the memories video. Enjoy the journey!");
        promptContainer.hide();
        memoriesVideo.show();
        playVideoFullScreen(memoriesVideo.get(0));
        backgroundAudio2.pause();
        backgroundAudio3.play();
    });

    memoriesVideo.on('ended', function(){
        updateGuideText("Want to call or message me? Click the buttons below.");
        memoriesVideo.hide();
        stopRecording();
        startOverButton.show();
        finalPromptContainer.show();
        backgroundAudio3.pause();
        backgroundAudio1.play();
        });
        startOverButton.on('click', function() {
            updateGuideText("Click the button to start the surprise again.");
            startOverButton.hide();
            surpriseButton.show();
            finalPromptContainer.hide();
            backgroundAudio1.play();
        });
        
        callButton.on('click', function() {
            window.location.href = 'tel:+1234567890'; // Replace with your phone number
        });
        
        messageButton.on('click', function() {
            window.location.href = 'sms:+1234567890'; // Replace with your phone number
        });
        
        // Ensure background audio loops
        backgroundAudio1.loop = true;
        backgroundAudio2.loop = true;
        backgroundAudio3.loop = true;
        
        // Mute/Unmute button functionality
        muteButton.on('click', function() {
            if (!isMuted) {
                backgroundAudio1.muted = true;
                backgroundAudio2.muted = true;
                backgroundAudio3.muted = true;
                isMuted = true;
            } else {
                backgroundAudio1.muted = false;
                backgroundAudio2.muted = false;
                backgroundAudio3.muted = false;
                isMuted = false;
            }
        });
    });
