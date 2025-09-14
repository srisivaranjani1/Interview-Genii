require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const axios = require("axios");

//const sendSMS = require("./utils/sendSMS");
const sendEmail = require("./utils/sendEmail");
const feedbackRoutes = require("./routes/feedbackRoutes");
const authRoutes = require("./routes/authRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const scheduleReminders = require("./reminderScheduler");

const app = express();

// app.use(cors({ origin: "*" }));

app.use(cors({
  origin: "https://mockinterview-hyee.vercel.app", // replace with your real Vercel URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// =====================
// MongoDB Connection
// =====================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    seedQuestions();
    scheduleReminders();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// =====================
// Routes
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/feedback", feedbackRoutes);

// =====================
// Models
// =====================
const resultSchema = new mongoose.Schema({
  question: String,
  originalText: String,
  correctedText: String,
  grammarScore: Number,
  emotion: String,
  emotionConfidence: Number,
  overallScore: Number,
  feedback: String,
  createdAt: { type: Date, default: Date.now },
});
const Result = mongoose.model("Result", resultSchema);

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  domain: {
    type: String,
    required: true,
    enum: [
      "full-stack", "mern-stack", "embedded-iot",
      "ui-ux-designer", "vlsi", "vr", "marketing", "associate-engineering"
    ],
  },
});
const Question = mongoose.model("Question", questionSchema);

// =====================
// Save a Result
// =====================
app.post("/api/save-result", async (req, res) => {
  try {
    const {
      question,
      originalText,
      correctedText,
      grammarScore,
      emotion,
      emotionConfidence,
      overallScore,
      feedback,
    } = req.body;

    const newResult = new Result({
      question,
      originalText,
      correctedText,
      grammarScore,
      emotion,
      emotionConfidence,
      overallScore,
      feedback,
      createdAt: new Date(),
    });

    await newResult.save();
    res.status(200).json({ message: "Result saved successfully" });
  } catch (err) {
    console.error("Error saving result:", err);
    res.status(500).json({ message: "Failed to save result" });
  }
});

// =====================
// Get Latest Result
// =====================
app.get("/api/get-latest-result", async (req, res) => {
  try {
    const latest = await Result.findOne().sort({ createdAt: -1 });
    if (!latest) return res.status(404).json({ message: "No results found" });
    res.json(latest);
  } catch (err) {
    console.error("Error fetching latest result:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================
// Get All Results
// =====================
app.get("/api/results", async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    console.error("Error fetching all results:", err);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

// =====================
// Resume Upload + AI Question Generation
// =====================
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    const prompt = `
Given the following resume content, generate 5 technical interview questions based on the candidate's skills, achievements, and programming languages.

Resume:
${resumeText}
    `;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful technical interviewer." },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Invalid response from OpenRouter API");

    res.json({ questions: content });
    fs.unlinkSync(req.file.path); // Cleanup
  } catch (err) {
    console.error("Upload Error:", err.message || err);
    res.status(500).json({
      error: "Failed to process resume or call OpenRouter API",
      details: err.message,
    });
  }
});

// =====================
// Seed Domain Questions
// =====================
const seedQuestions = async () => {
  const domainQuestions = {
    "full-stack": [
      "What is React?",
      "Explain Node.js architecture.",
      "What are RESTful APIs?"
    ],
    "mern-stack": [
      "How does MongoDB differ from SQL?",
      "Explain Express middleware.",
      "What are React hooks?"
    ],
    "embedded-iot": [
      "What is an embedded system?",
      "Explain IoT architecture.",
      "What are microcontrollers?"
    ],
    "ui-ux-designer": [
      "What are the key principles of UX design?",
      "Explain the difference between UI and UX.",
      "What tools do you use for UI/UX design?"
    ],
    "vlsi": [
      "What is VLSI technology?",
      "Explain CMOS technology in VLSI.",
      "What are the design challenges in VLSI?"
    ],
    "vr": [
      "What is Virtual Reality?",
      "Explain the difference between AR and VR.",
      "What are the key components of a VR system?"
    ],
    "marketing": [
      "What are the 4Ps of marketing?",
      "Explain digital marketing strategies.",
      "How does social media impact marketing?"
    ],
    "associate-engineering": [
      "What does an associate engineer do?",
      "Explain the basics of project management.",
      "What are key engineering ethics?"
    ],
  };

  for (const [domain, questions] of Object.entries(domainQuestions)) {
    for (const question of questions) {
      const exists = await Question.findOne({ domain, question });
      if (!exists) {
        await Question.create({ domain, question });
        console.log(`✅ Added question for ${domain}: ${question}`);
      }
    }
  }

  console.log("✅ Interview questions seeding complete");
};

// =====================
// Get Questions by Domain
// =====================
app.get("/api/questions/:domain", async (req, res) => {
  try {
    const domain = req.params.domain.toLowerCase().replace(/\s/g, "-");
    const questions = await Question.find({ domain });

    if (!questions.length) {
      return res.status(404).json({ success: false, message: "No questions found for this domain" });
    }

    res.json({ success: true, questions });
  } catch (err) {
    console.error("Error fetching domain questions:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// =====================
// Email and SMS Reminders
// =====================
// app.get('/send-reminder', async (req, res) => {
//   const { phoneNumber, message } = req.query;
//   try {
//     const response = await sendSMS(phoneNumber, message);
//     res.json({ success: true, message: 'SMS sent successfully', response });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to send SMS', error: error.message });
//   }
// });

app.get('/send-email', async (req, res) => {
  const { email, subject, message } = req.query;
  try {
    const result = await sendEmail(email, subject, message);
    res.json({ success: true, message: 'Email sent successfully', result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Email failed', error: err.message });
  }
});


