import React, { useState } from "react";

type EnterResultsProps = {
  darkMode: boolean;
};

export default function EnterResults({ darkMode: d }: EnterResultsProps) {
  const bg = d ? "#0f0f1a" : "#f1f5f9";
  const card = d ? "#1c1c30" : "#ffffff";
  const brd = d ? "rgba(255,255,255,0.07)" : "#e2e8f0";
  const tx = d ? "#e2e8f0" : "#0f172a";
  const mt = d ? "#64748b" : "#94a3b8";
  const inp = d ? "#13132a" : "#f8fafc";

  const [filter, setFilter] = useState({
    className: "",
    subject: "",
    term: "1st Term",
    year: "2024",
  });

  const [students, setStudents] = useState([
    { id: 1, name: "Kamal Perera", marks: "" },
    { id: 2, name: "Sunil Silva", marks: "" },
    { id: 3, name: "Nayani Fernando", marks: "" },
    { id: 4, name: "Ruwan Kumara", marks: "" },
    { id: 5, name: "Kasun Jayasuriya", marks: "" },
  ]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleMarkChange = (id: number, marks: string) => {
    setStudents(students.map(s => s.id === id ? { ...s, marks } : s));
  };

  const handleSave = () => {
    alert("Results saved successfully!");
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
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: tx }}>Enter Results</h1>
          <p style={{ margin: 0, fontSize: 13, color: mt }}>Input marks for students by class and subject.</p>
        </div>

        {/* Filters */}
        <div style={{ background: card, border: `1px solid ${brd}`, borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
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
              <label style={labelStyle}>Subject</label>
              <select name="subject" value={filter.subject} onChange={handleFilterChange} style={inputStyle}>
                <option value="">Select subject...</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="History">History</option>
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

        {filter.className && filter.subject ? (
          <div style={{ background: card, border: `1px solid ${brd}`, borderRadius: 12, overflow: "hidden" }}>
            {/* Table Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "80px 1fr 150px",
              padding: "12px 20px", borderBottom: `1px solid ${brd}`,
              background: d ? "rgba(255,255,255,0.03)" : "#f8fafc",
            }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: mt, textTransform: "uppercase" }}>Index</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: mt, textTransform: "uppercase" }}>Student Name</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: mt, textTransform: "uppercase" }}>Marks (Out of 100)</span>
            </div>

            {/* Table Body */}
            {students.map((s, i) => (
              <div
                key={s.id}
                style={{
                  display: "grid", gridTemplateColumns: "80px 1fr 150px",
                  padding: "10px 20px", alignItems: "center",
                  borderBottom: i < students.length - 1 ? `1px solid ${brd}` : "none",
                }}
              >
                <span style={{ fontSize: 13, color: mt }}>#{1000 + s.id}</span>
                <span style={{ fontSize: 13, color: tx, fontWeight: 500 }}>{s.name}</span>
                <input
                  type="number"
                  min="0" max="100"
                  value={s.marks}
                  onChange={(e) => handleMarkChange(s.id, e.target.value)}
                  style={{ ...inputStyle, padding: "0.4rem 0.6rem", width: 100, textAlign: "center" }}
                  placeholder="-"
                />
              </div>
            ))}

            <div style={{ padding: "1.25rem 20px", borderTop: `1px solid ${brd}`, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleSave}
                style={{
                  padding: "0.6rem 1.5rem", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: "#a855f7", border: "none", color: "#fff", cursor: "pointer"
                }}
              >
                Save Results
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 2rem", background: card, border: `1px solid ${brd}`, borderRadius: 12 }}>
            <i className="ti ti-chart-bar" style={{ fontSize: 40, color: mt, marginBottom: 12, opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: 14, color: tx }}>Select a class and subject to enter marks</p>
          </div>
        )}
      </div>
    </main>
  );
}

