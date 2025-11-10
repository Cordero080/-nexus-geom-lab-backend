import { useRef, useEffect, useState, useCallback } from "react";

/**
 * Audio Analyzer Hook - Captures microphone input and analyzes frequency bands
 *
 * Returns real-time audio data for:
 * - Bass (20-200 Hz)
 * - Mids (200-2000 Hz)
 * - Highs (2000-20000 Hz)
 *
 * Usage:
 * const { bass, mids, highs, isActive, toggleAudio } = useAudioAnalyzer();
 */
export function useAudioAnalyzer() {
  const [isActive, setIsActive] = useState(false);
  const [audioData, setAudioData] = useState({
    bass: 0,
    mids: 0,
    highs: 0,
    overall: 0,
  });

  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const animationFrameRef = useRef(null);

  /**
   * Initialize Web Audio API
   */
  const initAudio = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      // Create audio context
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create analyzer node
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 512; // Smaller = faster response (was 2048)
      analyzer.smoothingTimeConstant = 0; // No smoothing = instant response
      analyzerRef.current = analyzer;

      // Create data array for frequency data
      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      dataArrayRef.current = dataArray;

      // Connect microphone to analyzer
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyzer);
      sourceRef.current = source;

      console.log("🎤 Audio analyzer initialized");
      setIsActive(true);

      // Start analyzing
      analyzeAudio();
    } catch (error) {
      console.error("Failed to initialize audio:", error);

      let errorMessage = "Microphone access denied or unavailable.\n\n";

      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        errorMessage +=
          "Please allow microphone access:\n" +
          "1. Click the 🔒 icon in browser address bar\n" +
          "2. Allow microphone permissions\n" +
          "3. Refresh the page";
      } else if (error.name === "NotFoundError") {
        errorMessage += "No microphone found. Please connect a microphone.";
      } else if (error.name === "NotReadableError") {
        errorMessage += "Microphone is already in use by another application.";
      } else {
        errorMessage += "Error: " + error.message;
      }

      alert(errorMessage);
      setIsActive(false);
    }
  }, []);

  /**
   * Analyze audio frequencies in real-time
   */
  const analyzeAudio = useCallback(() => {
    if (!analyzerRef.current || !dataArrayRef.current) return;

    const analyzer = analyzerRef.current;
    const dataArray = dataArrayRef.current;

    // Get frequency data
    analyzer.getByteFrequencyData(dataArray);

    // Calculate frequency ranges
    const nyquist = audioContextRef.current.sampleRate / 2;
    const binCount = dataArray.length;

    // Helper to get average amplitude in frequency range
    const getFrequencyRangeAverage = (lowFreq, highFreq) => {
      const lowBin = Math.floor((lowFreq / nyquist) * binCount);
      const highBin = Math.floor((highFreq / nyquist) * binCount);

      let sum = 0;
      let count = 0;

      for (let i = lowBin; i <= highBin; i++) {
        sum += dataArray[i];
        count++;
      }

      return count > 0 ? sum / count / 255 : 0; // Normalize to 0-1
    };

    // Calculate frequency bands
    const bass = getFrequencyRangeAverage(20, 200); // Bass/kick
    const mids = getFrequencyRangeAverage(200, 2000); // Vocals/instruments
    const highs = getFrequencyRangeAverage(2000, 20000); // Cymbals/sparkle

    // Overall volume
    const overall =
      dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length / 255;

    // Update state
    setAudioData({ bass, mids, highs, overall });

    // Continue loop
    animationFrameRef.current = requestAnimationFrame(analyzeAudio);
  }, []);

  /**
   * Stop audio analysis
   */
  const stopAudio = useCallback(() => {
    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Disconnect source
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsActive(false);
    setAudioData({ bass: 0, mids: 0, highs: 0, overall: 0 });
    console.log("🔇 Audio analyzer stopped");
  }, []);

  /**
   * Toggle audio on/off
   */
  const toggleAudio = useCallback(() => {
    if (isActive) {
      stopAudio();
    } else {
      initAudio();
    }
  }, [isActive, initAudio, stopAudio]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    bass: audioData.bass,
    mids: audioData.mids,
    highs: audioData.highs,
    overall: audioData.overall,
    isActive,
    toggleAudio,
  };
}
