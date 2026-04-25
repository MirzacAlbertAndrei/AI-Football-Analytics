import React, { useState } from "react";
import { apiPost } from "../api";

export default function CoachChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Ask me something about U Cluj tactical risk, player trends, buildup problems, or attacking impact.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  async function handleSend(e) {
    e.preventDefault();

    if (!question.trim()) return;

    const userQuestion = question.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const data = await apiPost("/coach/chat", {
        question: userQuestion,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer || "No answer received from coach.",
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Could not contact the AI coach endpoint.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">AI Coach Chat</h1>
        <p className="text-gray-500 mt-1">
          Ask tactical questions based on the backend analysis.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow border border-gray-100 flex-1 p-5 space-y-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-3xl p-4 rounded-2xl ${
              message.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-gray-100 text-gray-800"
            }`}
          >
            <p className="whitespace-pre-wrap">{message.text}</p>
          </div>
        ))}

        {loading && (
          <div className="mr-auto bg-gray-100 text-gray-600 p-4 rounded-2xl">
            Thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-3">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Example: Who should avoid buildup under pressure?"
          className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}