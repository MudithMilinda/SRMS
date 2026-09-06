import React, { useState } from "react";

type StudentResultsProps = {
  darkMode: boolean;
};

export default function StudentResults({ darkMode: d }: StudentResultsProps) {
  const bg = d ? "#0f0f1a" : "#f1f5f9";
  const card = d ? "#1c1c30" : "#ffffff";
  const brd = d ? "rgba(255,255,255,0.07)" : "#e2e8f0";
  const tx = d ? "#e2e8f0" : "#0f172a";
  const mt = d ? "#64748b" : "#94a3b8";

  const [term, setTerm] = useState("Term 1");

  // Dummy results data
  const resultsData = {
    "Term 1": [
      { id: 1, subject: "Mathematics", marks: 85, grade: "A", remarks: "Excellent" },
      { id: 2, subject: "Science", marks: 78, grade: "B", remarks: "Good" },
      { id: 3, subject: "History", marks: 92, grade: "A", remarks: "Outstanding" },
      { id: 4, subject: "English", marks: 65, grade: "C", remarks: "Needs Improvement" },
    ],
    "Term 2": [
      { id: 1, subject: "Mathematics", marks: 88, grade: "A", remarks: "Excellent progress" },
      { id: 2, subject: "Science", marks: 82, grade: "A", remarks: "Very Good" },
      { id: 3, subject: "History", marks: 90, grade: "A", remarks: "Consistent" },
      { id: 4, subject: "English", marks: 75, grade: "B", remarks: "Good effort" },
    ]
  };

  const currentResults = resultsData[term as keyof typeof resultsData] || [];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 700, color: tx }}>My Results</h1>
          <p style={{ margin: 0, fontSize: 13, color: mt }}>View your academic performance by term.</p>
        </div>
        
        <div>
          <select 
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            style={{
              padding: "0.6rem 1rem", borderRadius: 8, fontSize: 14,
              background: d ? "rgba(0,0,0,0.2)" : "#fff",
              border: `1px solid ${brd}`, color: tx, outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="Term 1">Term 1 - 2024</option>
            <option value="Term 2">Term 2 - 2024</option>
            <option value="Term 3">Term 3 - 2024</option>
          </select>
        </div>
      </div>

      <div style={{ background: card, border: `1px solid ${brd}`, borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: d ? "rgba(255,255,255,0.02)" : "#f8fafc", borderBottom: `1px solid ${brd}` }}>
              <th style={{ padding: "1rem", fontSize: 12, fontWeight: 600, color: mt, textTransform: "uppercase" }}>Subject</th>
              <th style={{ padding: "1rem", fontSize: 12, fontWeight: 600, color: mt, textTransform: "uppercase" }}>Marks</th>
              <th style={{ padding: "1rem", fontSize: 12, fontWeight: 600, color: mt, textTransform: "uppercase" }}>Grade</th>
              <th style={{ padding: "1rem", fontSize: 12, fontWeight: 600, color: mt, textTransform: "uppercase" }}>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {currentResults.map((result) => (
              <tr key={result.id} style={{ borderBottom: `1px solid ${brd}` }}>
                <td style={{ padding: "1rem", fontSize: 14, fontWeight: 500, color: tx }}>{result.subject}</td>
                <td style={{ padding: "1rem", fontSize: 14, fontWeight: 600, color: tx }}>{result.marks}%</td>
                <td style={{ padding: "1rem", fontSize: 14 }}>
                  <span style={{
                    padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700,
                    background: result.grade === "A" ? "rgba(34, 197, 94, 0.1)" : 
                                result.grade === "B" ? "rgba(59, 130, 246, 0.1)" : 
                                result.grade === "C" ? "rgba(234, 179, 8, 0.1)" : "rgba(239, 68, 68, 0.1)",
                    color: result.grade === "A" ? "#22c55e" : 
                           result.grade === "B" ? "#3b82f6" : 
                           result.grade === "C" ? "#eab308" : "#ef4444"
                  }}>
                    {result.grade}
                  </span>
                </td>
                <td style={{ padding: "1rem", fontSize: 14, color: mt }}>{result.remarks}</td>
              </tr>
            ))}
            {currentResults.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: mt, fontSize: 14 }}>
                  No results published yet for {term}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {currentResults.length > 0 && (
        <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: card, border: `1px solid ${brd}`, borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 13, color: mt }}>Overall Performance</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: tx }}>
              Average: {(currentResults.reduce((acc, curr) => acc + curr.marks, 0) / currentResults.length).toFixed(1)}%
            </p>
          </div>
          <button style={{
            padding: "0.6rem 1.25rem", borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: "rgba(168,85,247,0.1)", border: "none", color: "#a855f7", cursor: "pointer"
          }}>
            Download Report Card
          </button>
        </div>
      )}
    </div>
  );
}
