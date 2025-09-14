

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './Home.css';

export default function Home() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [mediaError, setMediaError] = useState(null);
  const [highlightedText, setHighlightedText] = useState('');
  const [grammarError, setGrammarError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [correctionsCount, setCorrectionsCount] = useState(0);
  const [emotions, setEmotions] = useState({});

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData);
      setQuestions(res.data.questions.split('\n').filter(q => q.trim() !== ''));
      setResumeUploaded(true);
    } catch (error) {
      alert('Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const loadModels = async () => {
    const MODEL_URL = '/models';
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  };

  const startEmotionDetection = () => {
    const interval = setInterval(async () => {
      if (videoRef.current) {
        const detections = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();
        if (detections && detections.expressions) {
          const expressions = detections.expressions;
          const percentages = {};
          let dominant = { emotion: '', value: 0 };

          for (const [emotion, value] of Object.entries(expressions)) {
            const percent = (value * 100).toFixed(2);
            percentages[emotion] = percent;
            if (value > dominant.value) {
              dominant = { emotion, value: percent };
            }
          }

          percentages['dominant'] = dominant.emotion;
          setEmotions(percentages);
        }
      }
    }, 1000);
    return interval;
  };

  const toggleMedia = async (type) => {
    try {
      if (type === 'video' && isVideoOn) {
        streamRef.current?.getVideoTracks().forEach(track => track.stop());
        setIsVideoOn(false);
        return;
      }
      if (type === 'audio' && isAudioOn) {
        streamRef.current?.getAudioTracks().forEach(track => track.stop());
        setIsAudioOn(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: type === 'video' ? { width: 320, height: 240 } : isVideoOn,
        audio: type === 'audio' ? true : isAudioOn,
      });

      streamRef.current = stream;

      if (videoRef.current && type === 'video') {
        videoRef.current.srcObject = stream;
      }

      if (type === 'video') {
        setIsVideoOn(true);
        await loadModels();
        startEmotionDetection();
      }
      if (type === 'audio') setIsAudioOn(true);
    } catch (err) {
      setMediaError(`Media Error: ${err.message}`);
      if (type === 'video') setIsVideoOn(false);
      if (type === 'audio') setIsAudioOn(false);
    }
  };

  const checkGrammar = async () => {
    if (!transcript.trim()) {
      setGrammarError('Please speak something first!');
      return;
    }

    setIsProcessing(true);
    setGrammarError(null);

    try {
      const formData = new URLSearchParams();
      formData.append('text', transcript);
      formData.append('language', 'en-US');
      formData.append('enabledOnly', 'false');

      const res = await axios.post('https://api.languagetool.org/v2/check', formData.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      let formattedText = transcript;
      const corrections = [];

      res.data.matches.forEach(error => {
        const { offset, length, message, replacements } = error;
        if (replacements.length > 0) {
          const bestReplacement = replacements[0].value;
          corrections.push({
            start: offset,
            end: offset + length,
            original: transcript.slice(offset, offset + length),
            correction: bestReplacement,
            message: message
          });
        }
      });

      setCorrectionsCount(corrections.length);

      corrections.sort((a, b) => b.start - a.start).forEach(corr => {
        const errorHtml = `<span class="error" title="${corr.message}">${corr.original}</span>`;
        const correctionHtml = `<span class="correct">${corr.correction}</span>`;
        formattedText =
          formattedText.slice(0, corr.start) +
          errorHtml + ' → ' + correctionHtml +
          formattedText.slice(corr.end);
      });

      setHighlightedText(formattedText);

      if (res.data.matches.length === 0) {
        setGrammarError('✅ No issues found! Your text is perfect!');
      } else {
        setGrammarError(`Found ${res.data.matches.length} issue(s). See highlights.`);
      }
    } catch (error) {
      setGrammarError('Grammar check failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ========================
  // Updated Evaluate Function
  // ========================
  const evaluateAnswer = async () => {
    if (!transcript.trim()) {
      alert('Please speak your answer before evaluating.');
      return;
    }

    const totalWords = transcript.trim().split(/\s+/).length;
    const grammarScore = Math.max(
      0,
      100 - Math.floor((correctionsCount / totalWords) * 100)
    );

    const dominantEmotion = emotions.dominant || "neutral";
    const emotionConfidence = parseFloat(emotions[dominantEmotion] || "0");

    // ---------------- Content Score based on AI Model Keywords ----------------
    const modelAnswer = highlightedText.replace(/<[^>]+>/g, ''); // strip HTML
    const keywords = modelAnswer
      .toLowerCase()
      .match(/\b\w+\b/g) || [];

    let matched = 0;
    const userWords = transcript.toLowerCase().match(/\b\w+\b/g) || [];
    keywords.forEach((kw) => {
      if (userWords.includes(kw)) matched++;
    });

    const contentScore = keywords.length
      ? Math.round((matched / keywords.length) * 100)
      : 0;

    // ---------------- Overall Score ----------------
    const overallScore = Math.round(
      grammarScore * 0.4 + emotionConfidence * 0.2 + contentScore * 0.4
    );

    const payload = {
      question: questions[currentIndex],
      originalText: transcript,
      correctedText: modelAnswer,
      grammarScore,
      emotion: dominantEmotion,
      emotionConfidence: emotionConfidence / 100,
      contentScore,
      overallScore,
      feedback: `Grammar: ${grammarScore}%, Dominant Emotion: ${dominantEmotion}, Content Score: ${contentScore}%`
    };

    try {
      await axios.post('http://localhost:5000/api/save-result', payload);
      alert(
        `✅ Saved! Grammar: ${grammarScore}%, Emotion: ${dominantEmotion}, Content: ${contentScore}%, Overall: ${overallScore}%`
      );
    } catch (err) {
      console.error(err);
      alert('❌ Failed to save evaluation');
    }
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
      SpeechRecognition.stopListening();
    };
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <div>Your browser doesn’t support Speech Recognition.</div>;
  }

  return (
    <div className="container">
      <div className="left-panel">
        {!resumeUploaded && (
          <>
            <div className="resume-upload-box">
              <input type="file" onChange={handleFileChange} accept=".pdf" />
              <button onClick={handleUpload}>
                {loading ? 'Uploading...' : 'Upload Resume'}
              </button>
            </div>

            <div className="instructions-box">
              <h3>📌 Instructions</h3>
              <ul>
                <li>Make sure your resume is in PDF format.</li>
                <li>Allow camera and microphone access.</li>
                <li>Click <strong>Start</strong> to begin speaking your answer.</li>
                <li>Use <strong>Check Grammar</strong> to review your response.</li>
                <li>Click <strong>Evaluate</strong> to calculate and save your score.</li>
              </ul>
            </div>
          </>
        )}

        {questions.length > 0 && (
          <div className="questions-box">
            <h3>Mock Interview</h3>
            <div className="question">{questions[currentIndex]}</div>
            {currentIndex < questions.length - 1 && (
              <button onClick={() => {
                setCurrentIndex(prev => prev + 1);
                resetTranscript();
                setHighlightedText('');
                setGrammarError(null);
              }}>
                Next Question
              </button>
            )}
            <div className="speech-box">
              <h4>Your Answer</h4>
              <div className="transcript">{transcript || '🎤 Speak to generate text...'}</div>
              <div className="highlighted" dangerouslySetInnerHTML={{ __html: highlightedText }} />
              {grammarError && (
                <div className={`feedback ${grammarError.includes('✅') ? 'success' : 'error'}`}>
                  {grammarError}
                </div>
              )}
              <div className="btn-group">
                <button onClick={() => SpeechRecognition.startListening({ continuous: true })}>Start</button>
                <button onClick={SpeechRecognition.stopListening}>Stop</button>
                <button onClick={checkGrammar} disabled={!transcript || isProcessing}>
                  {isProcessing ? 'Checking...' : 'Check Grammar'}
                </button>
                <button onClick={evaluateAnswer} disabled={!transcript}>Evaluate</button>
                <button onClick={() => {
                  resetTranscript();
                  setHighlightedText('');
                  setGrammarError(null);
                }}>Clear</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="right-panel">
        <div className="camera-box">
          <video ref={videoRef} autoPlay muted={!isAudioOn} playsInline />
          <div className="btn-group">
            <button onClick={() => toggleMedia('video')}>
              {isVideoOn ? 'Stop Camera' : 'Start Camera'}
            </button>
            <button onClick={() => toggleMedia('audio')}>
              {isAudioOn ? 'Stop Mic' : 'Start Mic'}
            </button>
          </div>
        </div>
        {Object.keys(emotions).length > 0 && (
          <div className="emotion-box">
            <h3>Emotion Detection</h3>
            <div>Dominant Emotion: {emotions.dominant}</div>
            {Object.entries(emotions).map(([emotion, percent]) => (
              <div key={emotion}>
                {emotion}: {percent}%
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
