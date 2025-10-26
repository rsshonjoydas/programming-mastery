# JavaScript Audio APIs

JavaScript provides multiple ways to work with audio in web applications, from simple playback to advanced sound synthesis.

---

## 1. HTML Audio and Video Elements

The `<audio>` and `<video>` elements provide built-in media playback capabilities with user interfaces.

### Basic Usage

```html
<audio src="song.mp3" controls></audio> <video src="movie.mp4" controls></video>
```

### Key Methods

```javascript
let audio = document.querySelector('audio');

audio.play(); // Start playback
audio.pause(); // Pause playback
audio.load(); // Reload the audio source
```

### Key Properties

```javascript
// Playback control
audio.currentTime = 30; // Skip to 30 seconds
audio.playbackRate = 1.5; // Play at 1.5x speed
audio.volume = 0.5; // Set volume (0.0 to 1.0)

// Read-only properties
audio.duration; // Total length in seconds
audio.paused; // true if paused
audio.ended; // true if playback finished
audio.muted; // true if muted
```

### Common Events

```javascript
audio.addEventListener('play', () => console.log('Playing'));
audio.addEventListener('pause', () => console.log('Paused'));
audio.addEventListener('ended', () => console.log('Finished'));
audio.addEventListener('timeupdate', () => {
  console.log('Current time:', audio.currentTime);
});
audio.addEventListener('volumechange', () => {
  console.log('Volume:', audio.volume);
});
```

---

## 2. The Audio() Constructor

Create and control audio programmatically without adding elements to the DOM.

### Basic Syntax

```javascript
let audio = new Audio(src);
```

### Simple Sound Effect

```javascript
// Load sound effect in advance
let soundEffect = new Audio('soundeffect.mp3');

// Play when user clicks
document.addEventListener('click', () => {
  soundEffect.play();
});
```

### Multiple Overlapping Sounds

To play the same sound multiple times simultaneously, clone the audio element:

```javascript
let soundEffect = new Audio('soundeffect.mp3');

document.addEventListener('click', () => {
  soundEffect.cloneNode().play(); // Creates new instance
});
```

**Why clone?**

- Each clone can play independently
- Enables overlapping sound effects
- Clones are garbage collected when finished

### Preloading Multiple Sounds

```javascript
// Preload sound effects
let sounds = {
  click: new Audio('click.mp3'),
  success: new Audio('success.mp3'),
  error: new Audio('error.mp3'),
};

// Play on demand
button.addEventListener('click', () => sounds.click.cloneNode().play());
```

### Controlling Playback

```javascript
let music = new Audio('background.mp3');

music.volume = 0.3; // Set volume
music.loop = true; // Enable looping
music.play(); // Start playing

// Pause after 10 seconds
setTimeout(() => music.pause(), 10000);
```

---

## 3. WebAudio API

The WebAudio API provides advanced audio processing and synthesis capabilities by connecting audio nodes together.

### Core Concepts

**Audio nodes** represent:

- **Sources**: Generate or provide audio (oscillators, buffers)
- **Effects**: Transform audio (gain, filters, delays)
- **Destinations**: Output audio (speakers, recorders)

**Workflow**:

1. Create an AudioContext
2. Create audio nodes
3. Connect nodes together
4. Start/stop sources

### Creating an Audio Context

```javascript
// Create audio context (Safari compatibility)
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
```

### Basic Synthesizer Example

Generate a D major chord that fades out:

```javascript
// Create audio context
let audioContext = new (AudioContext || webkitAudioContext)();

// Define frequencies for D major chord (D, F#, A)
let notes = [293.7, 370.0, 440.0];

// Create oscillator for each note
let oscillators = notes.map((note) => {
  let osc = audioContext.createOscillator();
  osc.frequency.value = note; // Set frequency in Hz
  osc.type = 'sine'; // Sine wave (default)
  return osc;
});

// Create gain node for volume control
let volumeControl = audioContext.createGain();

// Fade in quickly, then fade out slowly
volumeControl.gain.setTargetAtTime(1, 0.0, 0.02); // Ramp to 1
volumeControl.gain.setTargetAtTime(0, 0.1, 0.2); // Fade to 0

// Get default output (speakers)
let speakers = audioContext.destination;

// Connect nodes: oscillators → volume → speakers
oscillators.forEach((osc) => osc.connect(volumeControl));
volumeControl.connect(speakers);

// Play for 1.25 seconds
let startTime = audioContext.currentTime;
let stopTime = startTime + 1.25;

oscillators.forEach((osc) => {
  osc.start(startTime);
  osc.stop(stopTime);
});

// Handle completion
oscillators[0].addEventListener('ended', () => {
  console.log('Sound finished playing');
});
```

### WebAudio Node Types

#### Source Nodes

```javascript
// Oscillator (synthesized tone)
let osc = audioContext.createOscillator();
osc.type = 'sine'; // 'sine', 'square', 'sawtooth', 'triangle'
osc.frequency.value = 440; // A4 note

// Buffer source (recorded audio)
let bufferSource = audioContext.createBufferSource();
bufferSource.buffer = audioBuffer;

// Media element source (from <audio> tag)
let mediaSource = audioContext.createMediaElementSource(audioElement);
```

#### Effect Nodes

```javascript
// Gain (volume control)
let gain = audioContext.createGain();
gain.gain.value = 0.5;

// Biquad filter (EQ, lowpass, highpass)
let filter = audioContext.createBiquadFilter();
filter.type = 'lowpass';
filter.frequency.value = 1000;

// Delay
let delay = audioContext.createDelay();
delay.delayTime.value = 0.5; // 0.5 second delay

// Convolver (reverb)
let convolver = audioContext.createConvolver();

// Dynamics compressor
let compressor = audioContext.createDynamicsCompressor();
```

### Loading and Playing Audio Files

```javascript
async function loadSound(url) {
  let response = await fetch(url);
  let arrayBuffer = await response.arrayBuffer();
  let audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

// Usage
let audioBuffer = await loadSound('sound.mp3');

function playSound(buffer) {
  let source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
}

playSound(audioBuffer);
```

### Creating a Simple Beep

```javascript
function beep(frequency = 440, duration = 0.2) {
  let osc = audioContext.createOscillator();
  let gain = audioContext.createGain();

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.frequency.value = frequency;
  gain.gain.value = 0.3;

  osc.start();
  osc.stop(audioContext.currentTime + duration);
}

beep(440); // A4 note
beep(880); // A5 note (one octave higher)
```

### Advanced Example: Sequencer

```javascript
function playSequence(notes, bpm = 120) {
  let beatDuration = 60 / bpm; // Duration of one beat
  let currentTime = audioContext.currentTime;

  notes.forEach((note, index) => {
    let osc = audioContext.createOscillator();
    let gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.frequency.value = note.frequency;
    gain.gain.value = 0.3;

    let startTime = currentTime + index * beatDuration;
    let stopTime = startTime + note.duration * beatDuration;

    osc.start(startTime);
    osc.stop(stopTime);
  });
}

// Play a simple melody
let melody = [
  { frequency: 261.63, duration: 0.5 }, // C
  { frequency: 293.66, duration: 0.5 }, // D
  { frequency: 329.63, duration: 0.5 }, // E
  { frequency: 349.23, duration: 1.0 }, // F
];

playSequence(melody);
```

---

## Comparison of Audio APIs

| Feature              | `<audio>` Element      | Audio() Constructor  | WebAudio API                 |
| -------------------- | ---------------------- | -------------------- | ---------------------------- |
| **Use Case**         | Media playback with UI | Simple sound effects | Audio synthesis & processing |
| **Complexity**       | Low                    | Low                  | High                         |
| **File Support**     | MP3, WAV, OGG, etc.    | MP3, WAV, OGG, etc.  | Any via decoding             |
| **Synthesis**        | ❌ No                  | ❌ No                | ✅ Yes                       |
| **Effects**          | ❌ Limited             | ❌ Limited           | ✅ Advanced                  |
| **Timing Precision** | ⚠️ Moderate            | ⚠️ Moderate          | ✅ High                      |
| **Multiple Sources** | Manual cloning         | Manual cloning       | ✅ Native support            |

---

## Browser Compatibility Notes

### Audio Context

- Most modern browsers support `AudioContext`
- Safari requires `webkitAudioContext` prefix (older versions)

```javascript
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
```

### Autoplay Policies

Modern browsers restrict autoplay to prevent unwanted sounds:

```javascript
// Autoplay may be blocked
audio.play().catch((error) => {
  console.log('Autoplay prevented:', error);
});

// Require user interaction
button.addEventListener('click', () => {
  audio.play(); // Allowed after user gesture
});
```

### Audio Context State

Audio contexts may start in suspended state:

```javascript
if (audioContext.state === 'suspended') {
  audioContext.resume();
}
```

---

## Best Practices

✅ **Preload sounds** you'll use frequently
✅ **Use Audio() constructor** for simple sound effects
✅ **Use WebAudio API** for games, music apps, and complex audio
✅ **Clone audio elements** for overlapping sounds
✅ **Handle autoplay restrictions** with user interaction
✅ **Resume audio context** if suspended
✅ **Dispose of unused audio nodes** to prevent memory leaks
✅ **Use appropriate formats** (MP3 for compatibility, OGG/WebM for quality)
✅ **Compress audio files** to reduce loading time
✅ **Provide volume controls** for user experience

---

## Key Concepts Summary

🎵 **HTML Audio/Video** - Built-in media playback with controls
🎵 **Audio() Constructor** - Programmatic audio without DOM elements
🎵 **WebAudio API** - Advanced synthesis and audio processing
🎵 **Audio Nodes** - Building blocks connected to create audio graphs
🎵 **AudioContext** - Central object managing audio processing
🎵 **Oscillators** - Generate synthesized tones
🎵 **Gain Nodes** - Control volume and fading
🎵 **Buffer Sources** - Play recorded audio with precise timing
🎵 **Cloning** - Enable multiple overlapping sound instances
🎵 **Autoplay Policies** - Require user interaction in modern browsers
