export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black/40 backdrop-blur-xl border-t border-white/[0.08]">
      <div className="max-w-5xl mx-auto px-6 py-11">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-7">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#4BB8FA]/20 border border-[#4BB8FA]/30 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#4BB8FA" />
                  <rect x="10" y="2" width="6" height="6" rx="1.5" fill="#4BB8FA" opacity=".7" />
                  <rect x="2" y="10" width="6" height="6" rx="1.5" fill="#4BB8FA" opacity=".5" />
                  <rect x="10" y="10" width="6" height="6" rx="1.5" fill="#4BB8FA" opacity=".3" />
                </svg>
              </div>
              <span className="font-bold text-[15px] text-white">ResultHub</span>
            </div>
            <p className="text-[12px] text-white/35 leading-relaxed">
              Student result management — fast, reliable, and secure.
            </p>
          </div>

          <div>
            <h3 className="text-[11px] font-bold text-white/50 uppercase tracking-[0.08em] mb-3">Quick Links</h3>
            {[
              { label: "Check Results", href: "#search" },
              { label: "About Us", href: "#about" },
              { label: "Contact", href: "#contact" },
              { label: "Admin Portal", href: "/admin/login" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="block text-[12px] text-white/40 hover:text-white mb-[7px] transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          <div>
            <h3 className="text-[11px] font-bold text-white/50 uppercase tracking-[0.08em] mb-3">Contact</h3>
            {["info@resulthub.lk", "Student Affairs Office", "Mon – Fri, 8am – 5pm"].map((t) => (
              <p key={t} className="text-[12px] text-white/40 mb-[7px]">{t}</p>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.07] pt-4 flex flex-col sm:flex-row justify-between gap-2 text-[11px] text-white/25">
          <span>© {year} ResultHub. All rights reserved.</span>
          <span>Powered by ResultHub Platform</span>
        </div>
      </div>
    </footer>
  );
}