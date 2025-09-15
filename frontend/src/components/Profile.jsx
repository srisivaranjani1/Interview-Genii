import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

const Profile = () => {
  const [scoreData, setScoreData] = useState({
    score: 0,
    grammar: 0,
    sentiment: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Get logged-in user info
  const username = localStorage.getItem("username") || "Guest";
  const email = localStorage.getItem("userEmail") || "";

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!username || username === "Guest") {
      navigate("/login");
    }
  }, [username, navigate]);

  const user = {
    name: username,
    role: "Software Engineer",
    interviewDate: "Sep 15, 2025",
    profilePic:
      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?w=740",
  };

  useEffect(() => {
    const fetchLatestResult = async () => {
      try {
        const res = await axios.get("https://mockinterview-2-gxs9.onrender.com/api/get-latest-result");
        const data = res.data;

        setScoreData({
          score: Math.round(data.overallScore || 0),
          grammar: Math.round(data.grammarScore || 0),
          sentiment: Math.round(data.emotionConfidence || 0),
        });
      } catch (err) {
        console.error("Error fetching latest result:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestResult();
  }, []);

  const pieData = [
    { name: "Positive", value: scoreData.sentiment },
    { name: "Negative", value: 100 - scoreData.sentiment },
  ];

  const COLORS = ["#00C49F", "#FF8042"];

  const progressCircles = [
    { label: "Grammar", percent: scoreData.grammar, color: "#4CAF50" },
    { label: "Sentiment", percent: scoreData.sentiment, color: "#2196F3" },
    { label: "Interview", percent: scoreData.score, color: "#FF9800" },
  ];

  return (
    <div className={styles.profileContainer}>
      <header className={styles.header}>
        <h1>PROFILE</h1>
      </header>

      <div className={styles.profileGrid}>
        {/* Left Section */}
        <div className={styles.leftSection}>
          <div className={styles.profileCard}>
            <img src={user.profilePic} alt="Profile" />
            <div className={styles.profileInfo}>
              <h3>{user.name}</h3>
              <p>{user.role}</p>
              <p>{email}</p> {/* ✅ show email also */}
              <p>Interviewed on: {user.interviewDate}</p>
            </div>
          </div>

          <div className={styles.circleSection}>
            {progressCircles.map((circle, index) => {
              const radius = 30;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference * (1 - circle.percent / 100);

              return (
                <div className={styles.circleWrapper} key={index}>
                  <svg width="80" height="80">
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      stroke="#eee"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      stroke={circle.color}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      transform="rotate(-90 40 40)"
                      strokeLinecap="round"
                    />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dy="0.3em"
                      fontSize="14"
                      fill="#333"
                    >
                      {circle.percent}%
                    </text>
                  </svg>
                  <p>{circle.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          <div className={styles.card}>
            <h4>Overview</h4>
            <p>
              <strong>Score:</strong>{" "}
              {loading ? "Loading..." : `${scoreData.score}%`}
            </p>
            <p>
              <strong>Duration:</strong> 00:07:00
            </p>
            <p>
              <strong>Questions:</strong> 3
            </p>
          </div>

          <div className={styles.card}>
            <h4>Evaluation Summary</h4>
            <PieChart width={200} height={200}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                label
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div className={styles.card}>
            <h4>Strengths</h4>
            <ul>
              <li>Strong problem-solving skills</li>
              <li>Clear communication</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h4>Weaknesses</h4>
            <ul>
              <li>Nervous during answers</li>
              <li>Lacks confidence</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
