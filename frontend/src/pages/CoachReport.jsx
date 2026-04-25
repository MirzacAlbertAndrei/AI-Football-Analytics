import React, { useEffect, useState } from "react";
import { apiGet } from "../api";

export default function CoachReport() {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        setError("");

        const data = await apiGet("/coach/report");
        setReport(data.coach_report || "No report available.");
      } catch (err) {
        console.error(err);
        setError("Could not load coach report from backend.");
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8 bg-zinc-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight uppercase">
            AI Coach <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-red-600">Report</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2 tracking-wide uppercase text-sm">
            AI ANALYSIS INTERFACE • U CLUJ TACTICAL DOSSIER
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium tracking-wide uppercase text-sm">
            Compiling tactical dossier...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-5 rounded-r-xl shadow-sm font-medium">
          {error}
        </div>
      )}

      {/* Report Content */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 max-w-5xl mx-auto">
          {/* Accent line on top */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-black group-hover:bg-red-600 transition-colors duration-300"></div>
          
          <div className="p-8 md:p-12">
            {/* Document Header */}
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-5">
              {/* Document Icon */}
              <svg 
                className="w-7 h-7 text-gray-300 group-hover:text-red-600 transition-colors duration-300" 
                fill="none" 
                strokeWidth="2.5" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h3 className="text-2xl font-black text-black uppercase tracking-widest">
                Executive Summary
              </h3>
            </div>

            {/* The actual text */}
            <pre className="whitespace-pre-wrap font-sans text-gray-800 text-lg leading-relaxed bg-transparent border-0 p-0 m-0">
              {report}
            </pre>
          </div>

          {/* Document Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex justify-between items-center group-hover:bg-red-50 transition-colors duration-300">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-red-400 transition-colors duration-300">
              Confidential • Internal Technical Staff Only
            </p>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-red-400 transition-colors"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-red-500 transition-colors"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full group-hover:bg-red-600 transition-colors"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}