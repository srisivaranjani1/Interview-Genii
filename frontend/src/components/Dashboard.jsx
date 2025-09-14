import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import MicIcon from '@mui/icons-material/Mic';
import './Dashboard.css'; // Updated to match the new file name

const Dashboard = () => {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [correctedText, setCorrectedText] = useState('');
  const [checkingGrammar, setCheckingGrammar] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false); // Added loading state

  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const domains = [
    'full-stack', 'mern-stack', 'embedded-iot',
    'ui-ux-designer', 'vlsi', 'vr', 'marketing', 'associate-engineering'
  ];

  const fetchQuestions = async (domain) => {
    setLoadingQuestions(true);  // Start loading
    try {
      const res = await axios.get(`http://localhost:5000/api/questions/${domain}`);
      if (res.data.success && res.data.questions) {
        setQuestions(res.data.questions);
        setCurrentIndex(0);
        setTimer(30);
        setScore(0);
        resetTranscript();
      } else {
        console.error('No questions found or error fetching questions');
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoadingQuestions(false); // Stop loading
    }
  };

  useEffect(() => {
    if (!selectedDomain || questions.length === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          handleNextQuestion();
          return 30;
        } else {
          return prev - 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedDomain, questions, currentIndex]);

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
    resetTranscript();
    setScore(0);
    setCorrectedText('');
  };

  const checkGrammar = async () => {
    if (!transcript.trim()) return;
    setCheckingGrammar(true);
    try {
      const response = await axios.post("https://api.languagetool.org/v2/check", null, {
        params: {
          text: transcript,
          language: "en-US"
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      const matches = response.data.matches;
      const totalWords = transcript.trim().split(/\s+/).length;
      const mistakes = matches.length;
      const accuracy = Math.max(0, 100 - (mistakes / totalWords) * 100).toFixed(2);
      setScore(accuracy);
      setCorrectedText(transcript);
    } catch (err) {
      console.error("Grammar check failed", err);
    } finally {
      setCheckingGrammar(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn’t support speech recognition.</span>;
  }

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>🎤 AI Interview Assistant</h1>
      </div>

      {!selectedDomain && (
        <div className="select-prompt animate-prompt">
          Please select your domain to begin...
        </div>
      )}

      <div className="domain-buttons">
        {domains.map((domain) => (
          <button
            key={domain}
            className={`domain-btn ${selectedDomain === domain ? 'selected' : ''}`}
            onClick={() => {
              setSelectedDomain(domain);
              fetchQuestions(domain);
            }}
          >
            {domain.replace('-', ' ')}
          </button>
        ))}
      </div>

      {loadingQuestions && <div>Loading questions...</div>} {/* Loading indicator */}

      {questions.length > 0 && (
        <div className="question-box fade-in">
          <div className="question">{questions[currentIndex]?.question}</div>
          <div className="timer">⏳ {timer} sec</div>

          <button className="mic-btn" onClick={SpeechRecognition.startListening}>
            <MicIcon />
          </button>

          <div style={{ marginTop: '15px', color: '#ccc' }}>
            🎙 {listening ? "Listening..." : transcript}
          </div>

          <button onClick={checkGrammar} style={{ marginTop: '10px' }} disabled={checkingGrammar}>
            ✅ {checkingGrammar ? "Checking..." : "Check Grammar"}
          </button>

          <div className="progress-ring" style={{ "--percent": score }}>
            {score}%
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
