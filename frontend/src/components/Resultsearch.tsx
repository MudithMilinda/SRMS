import { useState } from "react";

interface SubjectResult {
  subject: string;
  marks: number;
  grade: string;
  status: "Pass" | "Fail";
}

interface ResultData {
  studentName: string;
  indexNo: string;
  institute: string;
  course: string;
  subjects: SubjectResult[];
  overallStatus: "Pass" | "Fail";
}

const gradeStyles: Record<string, string> = {
  A: "bg-[#4BB8FA]/20 text-[#4BB8FA] border border-[#4BB8FA]/30",
  B: "bg-[#1591DC]/20 text-[#60b4e8] border border-[#1591DC]/30",
  C: "bg-yellow-400/15 text-yellow-300 border border-yellow-400/30",
  D: "bg-orange-400/15 text-orange-300 border border-orange-400/30",
  F: "bg-red-400/15 text-red-400 border border-red-400/30",
};

// Replace with real API call
async function fetchResult(indexNo: string, institute: string): Promise<ResultData | null> {
  await new Promise((r) => setTimeout(r, 900));
  const mock: Record<string, ResultData> = {
    "2024/CS/001|MIT Campus": {
      studentName: "Kasun Perera", indexNo: "2024/CS/001", institute: "MIT Campus",
      course: "BSc Computer Science", overallStatus: "Pass",
      subjects: [
        { subject: "Mathematics", marks: 85, grade: "A", status: "Pass" },
        { subject: "Programming Fundamentals", marks: 92, grade: "A", status: "Pass" },
        { subject: "Data Structures", marks: 74, grade: "B", status: "Pass" },
        { subject: "Database Systems", marks: 68, grade: "C", status: "Pass" },
        { subject: "Networks", marks: 55, grade: "D", status: "Pass" },
      ],
    },
    "2024/IT/042|NSBM": {
      studentName: "Nimasha Fernando", indexNo: "2024/IT/042", institute: "NSBM",
      course: "BSc Information Technology", overallStatus: "Fail",
      subjects: [
        { subject: "Web Technology", marks: 88, grade: "A", status: "Pass" },
        { subject: "Software Engineering", marks: 76, grade: "B", status: "Pass" },
        { subject: "Operating Systems", marks: 40, grade: "F", status: "Fail" },
        { subject: "Digital Logic", marks: 62, grade: "C", status: "Pass" },
      ],
    },
  };
  return mock[`${indexNo}|${institute}`] ?? null;
}

export default function ResultSearch() {
  const [indexNo, setIndexNo] = useState("");
  const [institute, setInstitute] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!indexNo.trim() || !institute.trim()) return;
    setLoading(true); setResult(null); setNotFound(false);
    const data = await fetchResult(indexNo.trim(), institute.trim());
    setLoading(false);
    data ? setResult(data) : setNotFound(true);
  };

  const reset = () => { setResult(null); setNotFound(false); setIndexNo(""); setInstitute(""); };

  const avg = result ? Math.round(result.subjects.reduce((s, x) => s + x.marks, 0) / result.subjects.length) : 0;

  return (
    <section id="search" className="py-16 px-6 relative">
      <div className="max-w-[580px] mx-auto">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-[#4BB8FA] uppercase text-center mb-3">
          Result Portal
        </p>
        <h2 className="text-[26px] font-bold text-white text-center mb-2 tracking-tight">Check Your Results</h2>
        <p className="text-[13px] text-white/45 text-center mb-7">
          Enter your index number and institute to view results instantly.
        </p>

        {/* Glass search card */}
        <div className="rounded-3xl p-7 bg-white/[0.07] backdrop-blur-[30px] border border-white/20 shadow-[0_16px_48px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.25)]">
          <div className="mb-4">
            <label className="block text-[12px] font-semibold text-white/60 uppercase tracking-[0.04em] mb-2">
              Index Number
            </label>
            <input
              type="text"
              placeholder="e.g. 2024/CS/001"
              value={indexNo}
              onChange={(e) => setIndexNo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-4 py-3 rounded-xl text-[14px] text-white placeholder-white/30 bg-white/[0.08] border border-white/15 backdrop-blur-md focus:outline-none focus:border-[#4BB8FA]/60 focus:bg-white/[0.12] focus:shadow-[0_0_0_3px_rgba(75,184,250,0.15)] transition-all"
            />
          </div>

          <div className="mb-5">
            <label className="block text-[12px] font-semibold text-white/60 uppercase tracking-[0.04em] mb-2">
              Institute
            </label>
            <input
              type="text"
              placeholder="e.g. NSBM, MIT Campus"
              value={institute}
              onChange={(e) => setInstitute(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-4 py-3 rounded-xl text-[14px] text-white placeholder-white/30 bg-white/[0.08] border border-white/15 backdrop-blur-md focus:outline-none focus:border-[#4BB8FA]/60 focus:bg-white/[0.12] focus:shadow-[0_0_0_3px_rgba(75,184,250,0.15)] transition-all"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !indexNo.trim() || !institute.trim()}
            className="w-full py-[13px] rounded-[14px] text-[14px] font-bold text-white border border-[#4BB8FA]/50 bg-gradient-to-br from-[#2C5EAD]/90 to-[#1591DC]/90 shadow-[0_4px_20px_rgba(75,184,250,0.2),inset_0_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_8px_30px_rgba(75,184,250,0.4)] hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="30 60" />
                </svg>
                Searching...
              </span>
            ) : "Search Results"}
          </button>
        </div>

        {/* Not found */}
        {notFound && (
          <div className="mt-5 rounded-2xl p-7 bg-white/[0.07] backdrop-blur-xl border border-white/20 text-center">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="mx-auto mb-3">
              <circle cx="22" cy="22" r="20" stroke="rgba(248,113,113,0.6)" strokeWidth="1.5" />
              <path d="M22 14v12M22 30v1.5" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <p className="text-[14px] font-semibold text-white/80 mb-1">No results found</p>
            <p className="text-[12px] text-white/35">Check your index number and institute name.</p>
            <button onClick={reset} className="mt-3 text-[12px] text-[#4BB8FA] hover:underline">Try again</button>
          </div>
        )}

        {/* Result card */}
        {result && (
          <div className="mt-5 rounded-3xl overflow-hidden bg-white/[0.07] backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#2C5EAD]/70 to-[#1591DC]/60 backdrop-blur-xl border-b border-white/10 px-6 py-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] text-white/55 uppercase tracking-[0.08em] mb-1">{result.institute}</p>
                  <p className="text-[22px] font-extrabold text-white tracking-tight">{result.studentName}</p>
                  <p className="text-[13px] text-[#4BB8FA] mt-0.5">{result.course}</p>
                </div>
                <span className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.05em] ${result.overallStatus === "Pass" ? "bg-green-400/25 text-green-300 border border-green-400/30" : "bg-red-400/20 text-red-400 border border-red-400/30"}`}>
                  {result.overallStatus}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 mt-4">
                {[
                  { label: "Index No.", value: result.indexNo },
                  { label: "Average", value: `${avg}%` },
                  { label: "Subjects", value: String(result.subjects.length) },
                ].map((s) => (
                  <div key={s.label} className="bg-white/[0.08] rounded-xl px-3 py-2.5 border border-white/10">
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.06em]">{s.label}</p>
                    <p className="text-[15px] font-bold text-white mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Subjects */}
            <div className="px-6 py-4 bg-white/[0.04]">
              <p className="text-[10px] font-bold text-white/35 uppercase tracking-[0.1em] mb-3">Subject Results</p>
              {result.subjects.map((sub) => (
                <div key={sub.subject} className="flex items-center justify-between py-[11px] border-b border-white/[0.07] last:border-0">
                  <span className="text-[13px] text-white/80">{sub.subject}</span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[13px] font-semibold text-white">{sub.marks}</span>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-extrabold ${gradeStyles[sub.grade] ?? "bg-white/10 text-white/60"}`}>
                      {sub.grade}
                    </div>
                    <span className={`text-[11px] font-semibold w-8 text-right ${sub.status === "Pass" ? "text-green-400" : "text-red-400"}`}>
                      {sub.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-white/[0.08] bg-black/15 flex justify-between items-center">
              <span className="text-[11px] text-white/30">
                Issued by ResultHub — {new Date().toLocaleDateString("en-GB")}
              </span>
              <button onClick={reset} className="text-[12px] text-[#4BB8FA] hover:underline">New search</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}