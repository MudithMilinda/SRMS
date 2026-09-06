import React, { useState } from "react";
import { getProfile, updateProfile, changePassword, getErrorMessage } from "../../api/adminApi";

type SettingsProps = {
  darkMode: boolean;
};

export default function Settings({ darkMode: d }: SettingsProps) {
  const bg = d ? "#0f0f1a" : "#f1f5f9";
  const card = d ? "#1c1c30" : "#ffffff";
  const brd = d ? "rgba(255,255,255,0.07)" : "#e2e8f0";
  const tx = d ? "#e2e8f0" : "#0f172a";
  const mt = d ? "#64748b" : "#94a3b8";
  const inpBg = d ? "#13132a" : "#f8fafc";

  const [formData, setFormData] = useState({
    name: "Admin User",
    email: "admin@school.com",
    phone: "+94 77 123 4567",
    topBarName: "Admin",
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Page eka open wena welawata, DB eke thiyena real profile data eka load karanawa
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();

        setFormData((prev) => ({
          ...prev,
          name: data.admin.name ?? prev.name,
          email: data.admin.email ?? prev.email,
          phone: data.admin.phone ?? prev.phone,
          topBarName: data.admin.topBarName ?? prev.topBarName,
        }));
      } catch (error) {
        // Profile load wenne nathnam, default values thibba widihatama thiyanawa
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        topBarName: formData.topBarName,
      });

      alert("Profile settings saved successfully!");
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setPasswordLoading(true);

    try {
      await changePassword(formData.oldPassword, formData.newPassword);

      alert("Password changed successfully!");
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setPasswordLoading(false);
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
    background: inpBg,
    border: `1px solid ${brd}`,
    borderRadius: 8,
    padding: "0.6rem 0.8rem",
    fontSize: 13,
    color: tx,
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <main style={{ flex: 1, background: bg, minHeight: "100vh", padding: "2rem", overflowY: "auto" }}>
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
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0
              }}>
                <span style={{ color: "#fff", fontSize: 32, fontWeight: 700 }}>A</span>
              </div>
              <div>
                <label style={{
                  padding: "0.5rem 1rem", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: "rgba(168,85,247,0.1)", border: "none", color: "#a855f7", cursor: "pointer", display: "inline-block"
                }}>
                  Change Picture
                  <input type="file" accept="image/*" style={{ display: "none" }} />
                </label>
                <p style={{ margin: "0.5rem 0 0", fontSize: 12, color: mt }}>Recommended size: 256x256px</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Top Bar Name (Display Name)</label>
                <input type="text" name="topBarName" value={formData.topBarName} onChange={handleInputChange} style={inputStyle} required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={profileLoading}
                style={{
                  padding: "0.6rem 1.5rem", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: "#a855f7", border: "none", color: "#fff",
                  cursor: profileLoading ? "not-allowed" : "pointer",
                  opacity: profileLoading ? 0.7 : 1
                }}
              >
                {profileLoading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div style={{ background: card, border: `1px solid ${brd}`, borderRadius: 12, padding: "2rem" }}>
          <h2 style={{ margin: "0 0 1.5rem", fontSize: 16, fontWeight: 600, color: tx, borderBottom: `1px solid ${brd}`, paddingBottom: "0.5rem" }}>Change Password</h2>

          <form onSubmit={handleSavePassword}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", maxWidth: 400, marginBottom: "2rem" }}>
              <div>
                <label style={labelStyle}>Current Password</label>
                <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleInputChange} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>New Password</label>
                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} style={inputStyle} required />
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <button
                type="submit"
                disabled={passwordLoading}
                style={{
                  padding: "0.6rem 1.5rem", borderRadius: 8, fontSize: 13, fontWeight: 600,
                  background: "rgba(239, 68, 68, 0.1)", border: "none", color: "#ef4444",
                  cursor: passwordLoading ? "not-allowed" : "pointer",
                  opacity: passwordLoading ? 0.7 : 1
                }}
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </main>
  );
}