import React, { useState } from "react";

type StudentSettingsProps = {
  darkMode: boolean;
};

export default function StudentSettings({ darkMode: d }: StudentSettingsProps) {
  const bg = d ? "#0f0f1a" : "#f1f5f9";
  const card = d ? "#1c1c30" : "#ffffff";
  const brd = d ? "rgba(255,255,255,0.07)" : "#e2e8f0";
  const tx = d ? "#e2e8f0" : "#0f172a";
  const mt = d ? "#64748b" : "#94a3b8";
  const inputBg = d ? "rgba(0,0,0,0.2)" : "#f8fafc";

  const [formData, setFormData] = useState({
    studentName: "John Doe",
    className: "Grade 10",
    phoneNum: "071 234 5678",
    address: "123 Main Street, Colombo",
    school: "Result Arena College",
    parentName: "Jane Doe",
    parentNumber: "077 987 6543"
  });

  const [profilePic, setProfilePic] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile settings saved successfully!");
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
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 1.5rem", fontSize: 24, fontWeight: 700, color: tx }}>Settings</h1>

      {/* Profile Settings */}
      <div style={{ background: card, border: `1px solid ${brd}`, borderRadius: 12, padding: "2rem", marginBottom: "2rem" }}>
        <h2 style={{ margin: "0 0 1.5rem", fontSize: 16, fontWeight: 600, color: tx, borderBottom: `1px solid ${brd}`, paddingBottom: "0.5rem" }}>Profile Information</h2>

        <form onSubmit={handleSaveProfile}>
          {/* Profile Picture */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: inputBg, border: `1px dashed ${brd}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden"
            }}>
              {profilePic ? (
                <img src={URL.createObjectURL(profilePic)} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <i className="ti ti-user" style={{ fontSize: 32, color: mt }} />
              )}
            </div>
            <div>
              <label style={{
                padding: "0.5rem 1rem", borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: "rgba(168,85,247,0.1)", border: "none", color: "#a855f7", cursor: "pointer", display: "inline-block"
              }}>
                Change Picture
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              </label>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: mt }}>PNG, JPG up to 5MB</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Student Name</label>
              <input
                type="text" name="studentName"
                value={formData.studentName} onChange={handleInputChange}
                style={inputStyle} required
              />
            </div>
            <div>
              <label style={labelStyle}>Class</label>
              <select
                name="className" value={formData.className} onChange={handleInputChange}
                style={inputStyle} required
              >
                <option value="">Select a class...</option>
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
                <option value="Grade 13">Grade 13</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="text" name="phoneNum"
                value={formData.phoneNum} onChange={handleInputChange}
                style={inputStyle} required
              />
            </div>
            <div>
              <label style={labelStyle}>School</label>
              <input
                type="text" name="school"
                value={formData.school} onChange={handleInputChange}
                style={inputStyle} required
              />
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Address</label>
            <textarea
              name="address" rows={3}
              value={formData.address} onChange={handleInputChange}
              style={{ ...inputStyle, resize: "vertical" }} required
            />
          </div>

          <div style={{ height: 1, background: brd, margin: "1.5rem 0" }} />
          <h2 style={{ margin: "0 0 1rem", fontSize: 15, fontWeight: 700, color: tx }}>Parent/Guardian Details</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "2rem" }}>
            <div>
              <label style={labelStyle}>Parent Name</label>
              <input
                type="text" name="parentName"
                value={formData.parentName} onChange={handleInputChange}
                style={inputStyle} required
              />
            </div>
            <div>
              <label style={labelStyle}>Parent Contact Number</label>
              <input
                type="text" name="parentNumber"
                value={formData.parentNumber} onChange={handleInputChange}
                style={inputStyle} required
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" style={{
              padding: "0.6rem 1.5rem", borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: "#a855f7", border: "none", color: "#fff", cursor: "pointer"
            }}>
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Removed Change Password section as requested */}
    </div>
  );
}
