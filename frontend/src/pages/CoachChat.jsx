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
    <div className="p-6 md:p-8 bg-zinc-50 min-h-screen flex flex-col font-sans h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-gray-200 pb-6 mb-6 shrink-0">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase">
            AI Coach <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-red-600">Chat</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2 tracking-wide uppercase text-sm">
            AI ANALYSIS INTERFACE • U CLUJ TACTICAL QUERY
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col flex-1 relative overflow-hidden">
        {/* Accent line on top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>

        {/* Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50/50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "user" ? (
                // User Message Block
                <div className="bg-black text-white p-5 rounded-xl rounded-br-sm shadow-md max-w-[85%] md:max-w-[70%] relative">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2 justify-end">
                    Analyst
                    <svg className="w-3.5 h-3.5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </p>
                  <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">{message.text}</p>
                </div>
              ) : (
                // AI Coach Message Block
                <div className="bg-white border border-gray-200 text-black p-5 rounded-xl rounded-bl-sm shadow-sm max-w-[85%] md:max-w-[70%] relative group hover:border-gray-300 transition-colors">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600 rounded-l-xl"></div>
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-2 pl-2 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
                    </svg>
                    AI Tactical Engine
                  </p>
                  <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed pl-2 text-gray-800">{message.text}</p>
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-5 rounded-xl rounded-bl-sm shadow-sm relative w-48">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600 rounded-l-xl opacity-50 animate-pulse"></div>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-3 pl-2 opacity-50">Processing</p>
                <div className="flex items-center gap-2 pl-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form Area */}
        <div className="bg-white border-t border-gray-200 p-4 md:p-6">
          <form onSubmit={handleSend} className="flex flex-col sm:flex-row gap-3">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Example: Who should avoid buildup under pressure?"
              className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-lg px-5 py-4 shadow-inner font-medium text-black focus:outline-none focus:border-red-600 focus:bg-white transition-colors placeholder-gray-400"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-black uppercase tracking-widest disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex justify-center items-center gap-2 shrink-0 group"
            >
              Execute
              <svg 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                strokeWidth="2.5" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}