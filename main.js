// Initialize SpeechSynthesis API:
const synth = window.speechSynthesis;

// Assign DOM elements to vars:
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
    // these are all the vars that input/impact or reflect impact of functionality.

// Initialize an array to hold the voices available on the API:
let voices = [];

// ===========================================================
// // Create a function to call the voices from the API:
// const getVoices = () => {
//     voices = synth.getVoices();
//     console.log(voices);
// }
// // invoke function:
// getVoices();
//     // this returns an empty array, not what we were expecting.
//     // getVoices() is an async operation; it takes time to access the API.
//     // need to add an event listener to hear the change
// if (synth.onvoiceschanged !== undefined) {
//     synth.onvoiceschanged = getVoices;
// }
//     // now we get an array of 27 objects, being the voices available.

// ==================================

// Having figured out how to get our voices, let's extend the function getVoices to create a list of options for our select element voiceSelect:

const getVoices = () => {
    voices = synth.getVoices();
    // console.log(voices);

    // Loop through our array and create an option element for each one. 
    // Set properties and data- attributes,
    // Then append each element created to our DOM element selectVoices.
    voices.forEach(voice => {
        // create option element
        const option = document.createElement("option");
        // fill option with text of name and language
        option.textContent = `${voice.name} (${voice.lang})`;
        // console.log(option);
        // set option data-attributes
        option.setAttribute("data-lang", voice.lang);
        option.setAttribute("data-name", voice.name);
        // console.log(option);
            // why set attributes? we're going to need them later to pass in to our speak function as part of selectedVoice var.
        // add option as child to element #voice-select, var voiceSelect.
        voiceSelect.appendChild(option);
    })    
    // console.log(voiceSelect); // SEE DUPLICATION BOGGLE BELOW
}

// ============= ********  SOMETHING HERE IS DUPLICATING, IS IT CALLING THE FUNCTION FROM OUTSIDE? 
// invoke function:
getVoices();
    // this returns an empty array, not what we were expecting.
    // getVoices() is an async operation; it takes time to access the API.
    // need to add an event listener to hear the change
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}
console.log(voiceSelect);

// ==================************** END POSS DUPLICATION

// Create function to call for App to speak:
const speak = ()=>{

    // condition: if you hit "Speak" button while it's speaking, log an error and leave the speak function:
    if (synth.speaking) {
        console.error("Already speaking...");
        return;
    }

    // condition: if there is something in the textarea to speak, then...
    if (textInput.value!=='') {
        // instantiate new utterance object:
        const speakText = new SpeechSynthesisUtterance(textInput.value);

        // Event: when finished speaking:
        speakText.onend = e=>{
            console.log("Finished speaking...");
        }

        // Event: speaking didn't happen error:
        speakText.onerror = e=>{
            console.error("Something went wrong here...");
        }

        // variable: find our voice as selected in the UI, and pass an attribute to use to set as our speakText.voice property:
        const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
            'data-name'
          );
      

        // function?: loop through array voices to match data attribute, and pass this as property to speakText.voice:
        voices.forEach(voice => {
            if (voice.name===selectedVoice) {
                speakText.voice = voice;
            }
        });

        console.log(selectedVoice);
        // feeling nervous: it's giving me the full array still.

        // Set pitch and rate
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;
        // Speak
        synth.speak(speakText);
    }
}
speak();


// =========== with a due sense of trepidation,
// "all we have to do now is set our event listeners to get app to fire up and work....." murphy time?

// EVENT LISTENERS:

// Text form submit:
textForm.addEventListener("submit", e=>{
    e.preventDefault;
    speak();
    textInput.blur(); // removes keyboard focus from element (cursor disappears)
});

// rate value changes:
rate.addEventListener("change", e=>{
    rateValue.textContent = rate.value;
});

// pitch value changes:
pitch.addEventListener("change", e=>{
    pitchValue.textContent = pitch.value;
});

// change in voice selected? call speak function again
voiceSelect.addEventListener("change", e=>speak());

// Definitely murphy time. 
// it makes no sound at all.
