import React, { useState } from "react";

type StudentSubmissionsProps = {
  darkMode: boolean;
};

export default function StudentSubmissions({ darkMode: d }: StudentSubmissionsProps) {
  const bg = d ? "#0f0f1a" : "#f1f5f9";
  const card = d ? "#1c1c30" : "#ffffff";
  const brd = d ? "rgba(255,255,255,0.07)" : "#e2e8f0";
  const tx = d ? "#e2e8f0" : "#0f172a";
  const mt = d ? "#64748b" : "#94a3b8";
  const inputBg = d ? "rgba(0,0,0,0.2)" : "#f8fafc";

  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !file) {
      alert("Please select an assignment and upload a file.");
      return;
    }
    console.log("Submitting:", { assignment: selectedAssignment, file: file.name, notes });
    alert("Assignment submitted successfully!");
    // Reset form after submission
    setSelectedAssignment("");
    setFile(null);
    setNotes("");
  };

  const labelStyle = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: tx,
    marginBottom: 8,
  };

  const inputStyle = {
    width: "100%",
    background: inputBg,
    border: `1px solid ${brd}`,
    borderRadius: 8,
    padding: "0.8rem 1rem",
    fontSize: 14,
    color: tx,
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 700, color: tx }}>Submit Assignment</h1>
        <p style={{ margin: 0, fontSize: 13, color: mt }}>Upload your completed assignments here.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: card, border: `1px solid ${brd}`, borderRadius: 12, padding: "2rem" }}>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>Select Assignment</label>
          <select
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            style={inputStyle}
            required
          >
            <option value="">-- Choose an assignment --</option>
            <option value="math">Mathematics Algebra Homework</option>
            <option value="history">History Essay on Ancient Rome</option>
          </select>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>Upload File (PDF, DOCX)</label>
          <div style={{
            border: `1px dashed ${brd}`, borderRadius: 12, padding: "2rem",
            textAlign: "center", background: inputBg,
            position: "relative", cursor: "pointer"
          }}>
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
              style={{
                position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                opacity: 0, cursor: "pointer"
              }}
            />
            <i className="ti ti-cloud-upload" style={{ fontSize: 48, color: "#a855f7", marginBottom: 16 }} />
            {file ? (
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: tx }}>{file.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: mt }}>{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: tx }}>Click or drag file to this area to upload</p>
                <p style={{ margin: 0, fontSize: 12, color: mt }}>Supports PDF, DOCX up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <label style={labelStyle}>Additional Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Type any comments for your teacher here..."
            rows={4}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" style={{
            padding: "0.8rem 2rem", borderRadius: 8, fontSize: 14, fontWeight: 600,
            background: "#a855f7", border: "none", color: "#fff", cursor: "pointer",
            transition: "background 0.2s"
          }}>
            Submit Work
          </button>
        </div>

      </form>
    </div>
  );
}

