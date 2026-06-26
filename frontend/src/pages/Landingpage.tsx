import Navbar from "../components/navbar";
import ResultSearch from "../components/Resultsearch";
import Footer from "../components/footer"

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "linear-gradient(135deg,#0a1628 0%,#0d2347 35%,#0f3460 65%,#1a4a7a 100%)" }}
    >
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute top-[-100px] right-[-80px] w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle,rgba(75,184,250,0.25) 0%,transparent 70%)" }} />
      <div className="pointer-events-none absolute bottom-[100px] left-[-60px] w-[300px] h-[300px] rounded-full"
        style={{ background: "radial-gradient(circle,rgba(21,145,220,0.2) 0%,transparent 70%)" }} />
      <div className="pointer-events-none absolute top-[40%] left-[30%] w-[200px] h-[200px] rounded-full"
        style={{ background: "radial-gradient(circle,rgba(44,94,173,0.3) 0%,transparent 70%)" }} />

      <Navbar />

      {/* Hero */}
      <section className="pt-[80px] pb-[60px] px-6 text-center relative">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-[#4BB8FA] uppercase mb-4 opacity-90">
          Student Result Management System
        </p>
        <h1 className="text-[42px] md:text-[52px] font-extrabold text-white leading-[1.15] mb-4 tracking-tight">
          Your results,{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg,#4BB8FA,#1591DC)" }}
          >
            instantly accessible
          </span>
        </h1>
        <p className="text-white/55 text-[15px] max-w-[420px] mx-auto mb-8 leading-[1.7]">
          Enter your index number and institute to view your academic results — fast, secure, and accurate.
        </p>
        <a
          href="#search"
          className="inline-block px-8 py-[13px] rounded-[14px] text-[14px] font-bold text-white border border-[#4BB8FA]/60 backdrop-blur-md transition-all hover:-translate-y-px"
          style={{
            background: "linear-gradient(135deg,rgba(44,94,173,0.8),rgba(21,145,220,0.8))",
            boxShadow: "0 4px 20px rgba(75,184,250,0.25),inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          Check My Results →
        </a>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3.5 max-w-[480px] mx-auto mt-14">
          {[
            { label: "Students", value: "12,400+" },
            { label: "Institutes", value: "38" },
            { label: "Results Issued", value: "94,000+" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-[18px] py-[18px] px-3 text-center bg-white/[0.07] backdrop-blur-xl border border-white/15"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.2)" }}
            >
              <p className="text-[22px] font-extrabold text-white">{s.value}</p>
              <p className="text-[11px] text-white/45 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <ResultSearch />

      {/* About */}
      <section id="about" className="py-16 px-6 relative">
        <div className="max-w-[760px] mx-auto grid md:grid-cols-2 gap-9 items-center">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#4BB8FA] uppercase mb-3">About</p>
            <h2 className="text-[24px] font-bold text-white mb-3 tracking-tight">
              Built for institutes that care about accuracy
            </h2>
            <p className="text-[13px] text-white/50 leading-[1.7] mb-5">
              ResultHub gives educational institutes a centralized platform to manage and publish student results — eliminating paperwork and making results accessible 24/7.
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                "Secure admin panel for result management",
                "Students check results anytime, anywhere",
                "Grade tracking across multiple courses",
                "Instant result publishing with one click",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2.5 text-[13px] text-white/65">
                  <div className="w-5 h-5 rounded-full bg-[#4BB8FA]/15 border border-[#4BB8FA]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#4BB8FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { icon: "🔒", title: "Secure & Reliable", desc: "JWT auth, role-based access control" },
              { icon: "⚡", title: "Fast Search", desc: "Results in under 1 second" },
              { icon: "📊", title: "Detailed Analytics", desc: "Grades, averages, pass/fail breakdown" },
            ].map((c) => (
              <div
                key={c.title}
                className="flex items-start gap-3.5 rounded-2xl p-4 bg-white/[0.07] backdrop-blur-xl border border-white/15"
              >
                <span className="text-[22px]">{c.icon}</span>
                <div>
                  <p className="text-[13px] font-bold text-white">{c.title}</p>
                  <p className="text-[11px] text-white/40 mt-0.5">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-14 px-6 border-t border-white/[0.07]">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-[22px] font-bold text-white mb-3">Need Help?</h2>
          <p className="text-white/45 text-[13px] mb-6">
            Contact your institute's admin office or reach out to us directly.
          </p>
          <a
            href="mailto:info@resulthub.lk"
            className="inline-block px-6 py-2.5 rounded-xl text-[13px] font-semibold text-[#4BB8FA] border border-[#4BB8FA]/40 bg-[#4BB8FA]/10 hover:bg-[#4BB8FA]/20 backdrop-blur-md transition-all"
          >
            info@resulthub.lk
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}