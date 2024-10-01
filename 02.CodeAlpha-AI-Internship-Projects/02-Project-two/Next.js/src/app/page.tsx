"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch FAQ questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:8000/faq/questions");
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  // Fetch answer based on user input or selected question
  const fetchAnswer = async (question: string) => {
    if (!question.trim()) {
      setAnswer(null);
      return; // Prevent fetching if the input is empty
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/faq/${encodeURIComponent(question)}`);
      setAnswer(response.data.answer || "No answer found.");
    } catch (error) {
      console.error("Error fetching answer:", error);
      setAnswer("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFD700] flex flex-col items-center justify-center p-6">
      <div className="bg-[#ffffff] shadow-lg rounded-lg w-full max-w-3xl mx-auto p-8">
        <h1 className="text-5xl font-bold text-[#D50000] text-center mb-8">EthioFAQBot</h1>

        <div className="mb-6">
          <p className="text-lg font-semibold text-[#FF6F00] mb-2">Select a question:</p>
          <select
            value={selectedQuestion}
            onChange={(e) => {
              setSelectedQuestion(e.target.value);
              fetchAnswer(e.target.value);
            }}
            className="w-full p-3 border border-[#FF6F00] rounded-lg shadow-sm focus:ring-2 focus:ring-[#D50000] transition duration-200 mb-4 text-lg font-bold text-green-700" // Bold green text
          >
            <option value="" disabled>Select a question</option>
            {questions.map((question, index) => (
              <option key={index} value={question}>{question}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              fetchAnswer(e.target.value);
            }}
            placeholder="Type your question..."
            className="w-full p-3 border border-[#FF6F00] rounded-lg shadow-sm focus:ring-2 focus:ring-[#D50000] transition duration-200 text-lg font-bold text-green-700" // Bold green text
          />
        </div>

        <button
          onClick={() => fetchAnswer(input)}
          className="w-full bg-[#D50000] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#A00000] transition duration-300"
          disabled={loading || (!selectedQuestion && !input.trim())}
        >
          {loading ? "Loading..." : "Get Answer"}
        </button>

        {answer && (
          <div className="mt-8 p-6 border border-[#FF6F00] rounded-lg shadow-md bg-gray-50">
            <p className="text-xl font-semibold text-[#D50000]">Answer:</p>
            <p className="mt-2 text-gray-800">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
