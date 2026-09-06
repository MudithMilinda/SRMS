import React, { useState } from "react";

type ViewResultsProps = {
  darkMode: boolean;
};

export default function ViewResults({ darkMode: d }: ViewResultsProps) {
  const bg = d ? "#0f0f1a" : "#f1f5f9";
  const card = d ? "#1c1c30" : "#ffffff";
  const brd = d ? "rgba(255,255,255,0.07)" : "#e2e8f0";
  const tx = d ? "#e2e8f0" : "#0f172a";
  const mt = d ? "#64748b" : "#94a3b8";
  const inp = d ? "#13132a" : "#f8fafc";

  const [filter, setFilter] = useState({
    className: "",
    term: "1st Term",
    year: "2024",
  });

  const students = [
    { id: 1, name: "Kamal Perera", math: 85, science: 78, english: 92, history: 88 },
    { id: 2, name: "Sunil Silva", math: 65, science: 70, english: 75, history: 80 },
    { id: 3, name: "Nayani Fernando", math: 92, science: 88, english: 95, history: 90 },
    { id: 4, name: "Ruwan Kumara", math: 45, science: 55, english: 60, history: 50 },
    { id: 5, name: "Kasun Jayasuriya", math: 78, science: 82, english: 80, history: 85 },
  ];

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: tx,
    marginBottom: 6,
  };

  const inputStyle = {
    width: "100%",
    background: inp,
    border: `1px solid ${brd}`,
    borderRadius: 8,
    padding: "0.6rem 0.8rem",
    fontSize: 13,
    color: tx,
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <main style={{ flex: 1, background: bg, minHeight: "100vh", padding: "1.5rem", overflowY: "auto" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: tx }}>View Results</h1>
          <p style={{ margin: 0, fontSize: 13, color: mt }}>View student performance and subject marks.</p>
        </div>

        {/* Filters */}
        <div style={{ background: card, border: `1px solid ${brd}`, borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Class</label>
              <select name="className" value={filter.className} onChange={handleFilterChange} style={inputStyle}>
                <option value="">Select class...</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Term</label>
              <select name="term" value={filter.term} onChange={handleFilterChange} style={inputStyle}>
                <option value="1st Term">1st Term</option>
                <option value="2nd Term">2nd Term</option>
                <option value="3rd Term">3rd Term</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Year</label>
              <select name="year" value={filter.year} onChange={handleFilterChange} style={inputStyle}>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
              </select>
            </div>
          </div>
        </div>

        {filter.className ? (
          <div style={{ background: card, border: `1px solid ${brd}`, borderRadius: 12, overflow: "hidden" }}>
            {/* Table Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "80px 2fr 1fr 1fr 1fr 1fr 1fr",
              padding: "12px 20px", borderBottom: `1px solid ${brd}`,
              background: d ? "rgba(255,255,255,0.03)" : "#f8fafc",
            }}>
              {["Index", "Student Name", "Maths", "Science", "English", "History", "Average"].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 600, color: mt, textTransform: "uppercase" }}>{h}</span>
              ))}
            </div>

            {/* Table Body */}
            {students.map((s, i) => {
              const avg = Math.round((s.math + s.science + s.english + s.history) / 4);
              const colorClass = avg >= 75 ? "#10b981" : avg >= 50 ? "#f59e0b" : "#ef4444";

              return (
                <div
                  key={s.id}
                  style={{
                    display: "grid", gridTemplateColumns: "80px 2fr 1fr 1fr 1fr 1fr 1fr",
                    padding: "14px 20px", alignItems: "center",
                    borderBottom: i < students.length - 1 ? `1px solid ${brd}` : "none",
                  }}
                >
                  <span style={{ fontSize: 13, color: mt }}>#{1000 + s.id}</span>
                  <span style={{ fontSize: 13, color: tx, fontWeight: 500 }}>{s.name}</span>
                  <span style={{ fontSize: 13, color: tx }}>{s.math}</span>
                  <span style={{ fontSize: 13, color: tx }}>{s.science}</span>
                  <span style={{ fontSize: 13, color: tx }}>{s.english}</span>
                  <span style={{ fontSize: 13, color: tx }}>{s.history}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: colorClass }}>{avg}%</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 2rem", background: card, border: `1px solid ${brd}`, borderRadius: 12 }}>
            <i className="ti ti-table" style={{ fontSize: 40, color: mt, marginBottom: 12, opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: 14, color: tx }}>Select a class to view student results</p>
          </div>
        )}
      </div>
    </main>
  );
}

