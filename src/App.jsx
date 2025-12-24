// import react hooks from React library 
import { useState, useEffect, useRef } from 'react';
// styling component 
import './App.css';

function App() {
  // creates a state variable bpm with 
  // intial value 120 and setBpm is the function to update bpm
  const [bpm, setBpm] = useState(120);

  // state variable isPlaying, initial value false 
  // setIsPlaying is a function to toggle whether metronome is currently playing 
  const [isPlaying, setIsPlaying] = useState(false);

  // persistent references; using useRef allows us to 
  // create a variable only once and reuse it every time we play a 
  // click (withstands re-renders)

  // stores the ID of the interval timer 
  const intervalRef = useRef(null);
  // stores the audiocontext instance that produces sound 
  // ref object created by useRef
  const audioCtxRef = useRef(null);


  const playClick = () => {
    // ensures that only one audio context object is created 
    if (!audioCtxRef.current) {
      // initializes and creates the instance of the audio context 
      audioCtxRef.current = new (window.AudioContext)();
    }
    
    // central object for managing and processing all audio within
    // webpage in the Web Audio API 
    const ctx = audioCtxRef.current;
    // node that generates the click sound 
    const osc = ctx.createOscillator();
    // gain node to control volume 
    const gain = ctx.createGain();

    // set the frequency of the click and its volume
    osc.frequency.value = 1000;
    gain.gain.value = 0.5;

    // connects audio nodes in a chain 
    osc.connect(gain);
    // destination = speakers (output)
    gain.connect(ctx.destination);

    // start sound 
    osc.start();
    // stops sound 50ms later (short, percussive click)
    osc.stop(ctx.currentTime + 0.05);
  };

// runs every time a value in the dependency array changes
// isPlaying or bpm 
  useEffect(() => {
    if (isPlaying) {
      // plays one click immediately 
      playClick();
      // calculates the time interval between clicks in miliseconds
      const delay = 60000 / bpm; 
      // calls setInterval (built in browser function that 
      // calls a function repeatedly every specified seconds)
      // returns an interval ID which is
      // passed later into clearInterval to stop it 
      intervalRef.current = setInterval(playClick, delay);
    } 
    // stop when isPlaying = false
    else {
      clearInterval(intervalRef.current);
    }
    // react always runs the cleanup before re-running effect 
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, bpm]);

  return (
    <div className="metronome-container">
      <h2>Metronome</h2>

      <div className="bpm-control">
        <label>BPM:</label>
        <span className="bpm-number">{bpm}</span>
      </div>

      <input
        type="range"
        min="40"
        max="220"
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
      />

      <div className="button-group">
        <button className="start-btn" onClick={() => setIsPlaying(true)}>
          Start
        </button>
        <button className="stop-btn" onClick={() => setIsPlaying(false)}>
          Stop
        </button>
      </div>
    </div>
  );
}

export default App;
