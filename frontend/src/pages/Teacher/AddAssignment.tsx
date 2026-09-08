import React, { useState, useEffect } from "react";
import { getClasses, createAssignment, getErrorMessage, type ClassType } from "../../api/adminApi";

type AddAssignmentProps = {
  darkMode: boolean;
};

export default function AddAssignment({ darkMode: d }: AddAssignmentProps) {
  const bg = d ? "#0f0f1a" : "#f1f5f9";
  const card = d ? "#1c1c30" : "#ffffff";
  const brd = d ? "rgba(255,255,255,0.07)" : "#e2e8f0";
  const tx = d ? "#e2e8f0" : "#0f172a";
  const mt = d ? "#64748b" : "#64748b";
  const inputBg = d ? "rgba(0,0,0,0.2)" : "#f8fafc";

  const [classes, setClasses] = useState<ClassType[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    classId: "",
    dueDate: "",
    instructions: "",
  });

  // Duration kept separate as hours/minutes so there's no ambiguity about units
  const [durationHours, setDurationHours] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load all classes from the DB for the dropdown
  useEffect(() => {
    (async () => {
      try {
        const data = await getClasses();
        setClasses(data.classes);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoadingClasses(false);
      }
    })();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("A file must be uploaded");
      return;
    }

    const hours = Number(durationHours) || 0;
    const minutes = Number(durationMinutes) || 0;

    if (hours === 0 && minutes === 0) {
      setError("Please set a duration");
      return;
    }
    if (minutes > 59) {
      setError("Minutes must be between 0 and 59");
      return;
    }

    // Sent to the backend as total minutes - unambiguous, easy to store/query
    const durationInMinutes = hours * 60 + minutes;

    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await createAssignment({
        title: formData.title,
        classId: formData.classId,
        dueDate: formData.dueDate,
        duration: durationInMinutes,
        instructions: formData.instructions,
        file,
      });
      setSuccess("Assignment uploaded successfully!");
      setFormData({ title: "", classId: "", dueDate: "", instructions: "" });
      setDurationHours("");
      setDurationMinutes("");
      setFile(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
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
    background: inputBg,
    border: `1px solid ${brd}`,
    borderRadius: 8,
    padding: "0.6rem 0.8rem",
    fontSize: 13,
    color: tx,
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <main style={{ flex: 1, background: bg, minHeight: "100vh", padding: "1.25rem", overflowY: "auto" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        <div style={{ marginBottom: "1.5rem" }}>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: tx }}>Add Assignment</h1>
          <p style={{ margin: 0, fontSize: 13, color: mt }}>Upload a new assignment for students.</p>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: card, border: `1px solid ${brd}`, borderRadius: 12, padding: "1.5rem" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Assignment Title</label>
              <input
                type="text" name="title" placeholder="e.g. Algebra Homework 3"
                value={formData.title} onChange={handleInputChange}
                style={inputStyle} required
              />
            </div>
            <div>
              <label style={labelStyle}>Duration</label>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    style={{ ...inputStyle, paddingRight: 42 }}
                    required
                  />
                  <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: mt, pointerEvents: "none" }}>
                    hrs
                  </span>
                </div>
                <div style={{ position: "relative", flex: 1 }}>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    placeholder="0"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    style={{ ...inputStyle, paddingRight: 42 }}
                    required
                  />
                  <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: mt, pointerEvents: "none" }}>
                    min
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Class</label>
              <select
                name="classId" value={formData.classId} onChange={handleInputChange}
                style={inputStyle} required disabled={loadingClasses}
              >
                <option value="">
                  {loadingClasses ? "Loading classes..." : "Select a class..."}
                </option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} — {c.class} ({c.teacher})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Due Date</label>
              <input
                type="date" name="dueDate"
                value={formData.dueDate} onChange={handleInputChange}
                style={{ ...inputStyle, color: formData.dueDate ? tx : mt }} required
              />
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Instructions</label>
            <textarea
              name="instructions" placeholder="Additional details or instructions for this assignment..." rows={4}
              value={formData.instructions} onChange={handleInputChange}
              style={{ ...inputStyle, resize: "vertical" }} required
            />
          </div>

          <div style={{ height: 1, background: brd, margin: "1.5rem 0" }} />
          <h2 style={{ margin: "0 0 1rem", fontSize: 15, fontWeight: 700, color: tx }}>Upload File</h2>

          <div style={{ marginBottom: "2rem" }}>
            <div style={{
              background: inputBg, border: `1px dashed ${brd}`, borderRadius: 12, padding: "2rem",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              cursor: "pointer", position: "relative"
            }}>
              <i className="ti ti-upload" style={{ fontSize: 32, color: mt, marginBottom: 12 }} />
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: tx }}>
                {file ? file.name : "Click or drag file to this area to upload"}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: mt }}>Support for a single PDF or DOCX file.</p>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                style={{
                  position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%"
                }}
                required={!file}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button
              type="button"
              disabled={submitting}
              style={{
                padding: "0.6rem 1.25rem", borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: "transparent", border: `1px solid ${brd}`, color: tx, cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "0.6rem 1.25rem", borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: "#a855f7", border: "none", color: "#fff",
                cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.6 : 1
              }}
            >
              {submitting ? "Uploading..." : "Upload Assignment"}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}