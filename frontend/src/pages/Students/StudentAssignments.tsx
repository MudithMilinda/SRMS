import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type StudentAssignmentsProps = {
  darkMode: boolean;
};

export default function StudentAssignments({ darkMode: d }: StudentAssignmentsProps) {
  const navigate = useNavigate();
  const bg = d ? "#0f0f1a" : "#f1f5f9";
  const card = d ? "#1c1c30" : "#ffffff";
  const brd = d ? "rgba(255,255,255,0.07)" : "#e2e8f0";
  const tx = d ? "#e2e8f0" : "#0f172a";
  const mt = d ? "#64748b" : "#94a3b8";

  // Dummy assignment data
  const [assignments] = useState([
    { id: 1, title: "Mathematics Algebra Homework", subject: "Mathematics", dueDate: "2024-05-15", status: "Pending" },
    { id: 2, title: "Science Lab Report", subject: "Science", dueDate: "2024-05-10", status: "Submitted" },
    { id: 3, title: "History Essay on Ancient Rome", subject: "History", dueDate: "2024-05-20", status: "Pending" },
  ]);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 700, color: tx }}>My Assignments</h1>
          <p style={{ margin: 0, fontSize: 13, color: mt }}>View and manage your assignments.</p>
        </div>
      </div>

      <div style={{ background: card, border: `1px solid ${brd}`, borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: d ? "rgba(255,255,255,0.02)" : "#f8fafc", borderBottom: `1px solid ${brd}` }}>
              <th style={{ padding: "1rem", fontSize: 12, fontWeight: 600, color: mt, textTransform: "uppercase" }}>Assignment</th>
              <th style={{ padding: "1rem", fontSize: 12, fontWeight: 600, color: mt, textTransform: "uppercase" }}>Subject</th>
              <th style={{ padding: "1rem", fontSize: 12, fontWeight: 600, color: mt, textTransform: "uppercase" }}>Due Date</th>
              <th style={{ padding: "1rem", fontSize: 12, fontWeight: 600, color: mt, textTransform: "uppercase" }}>Status</th>
              <th style={{ padding: "1rem", fontSize: 12, fontWeight: 600, color: mt, textTransform: "uppercase", textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id} style={{ borderBottom: `1px solid ${brd}` }}>
                <td style={{ padding: "1rem", fontSize: 14, fontWeight: 500, color: tx }}>{assignment.title}</td>
                <td style={{ padding: "1rem", fontSize: 14, color: mt }}>{assignment.subject}</td>
                <td style={{ padding: "1rem", fontSize: 14, color: mt }}>{assignment.dueDate}</td>
                <td style={{ padding: "1rem", fontSize: 14 }}>
                  <span style={{
                    padding: "4px 8px", borderRadius: 12, fontSize: 12, fontWeight: 600,
                    background: assignment.status === "Submitted" ? "rgba(34, 197, 94, 0.1)" : "rgba(234, 179, 8, 0.1)",
                    color: assignment.status === "Submitted" ? "#22c55e" : "#eab308"
                  }}>
                    {assignment.status}
                  </span>
                </td>
                <td style={{ padding: "1rem", textAlign: "right" }}>
                  <button
                    onClick={() => {
                      if (assignment.status === "Pending") {
                        navigate("/student/dashboard/submissions");
                      }
                    }}
                    style={{
                      padding: "0.4rem 0.8rem", borderRadius: 6, fontSize: 13, fontWeight: 600,
                      background: "rgba(168,85,247,0.1)", border: "none", color: "#a855f7", cursor: "pointer"
                    }}
                  >
                    {assignment.status === "Pending" ? "Submit" : "View"}
                  </button>
                </td>
              </tr>
            ))}
            {assignments.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: mt, fontSize: 14 }}>
                  No assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

