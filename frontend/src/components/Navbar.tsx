"use client";

import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 pt-4">
      <nav className="w-full">
        <div
          className="
            h-20
            rounded-full
            bg-[#163454]/90
            backdrop-blur-2xl
            border border-white/10
            shadow-[0_10px_40px_rgba(0,0,0,0.35)]
            flex items-center justify-between
            px-10
          "
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#4BB8FA]/10 border border-[#4BB8FA]/30 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7FC8FF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 19c3-5 7-9 14-14-2 7-6 11-11 14H5z" />
                <path d="M5 19l-2 2" />
                <path d="M10 14l4 4" />
              </svg>
            </div>

            <span className="text-white text-3xl font-extrabold tracking-tight">
              ResultHub
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-16">
            <a
              href="#search"
              className="text-lg font-semibold text-white hover:text-[#8FD2FF] transition"
            >
              Check Results
            </a>

            <a
              href="#about"
              className="text-lg font-semibold text-white hover:text-[#8FD2FF] transition"
            >
              About
            </a>

            <a
              href="#contact"
              className="text-lg font-semibold text-white hover:text-[#8FD2FF] transition"
            >
              Contact
            </a>
          </div>

          {/* Desktop Button */}
          <div className="hidden md:block">
            <a
              href="/admin/login"
              className="
                px-10
                py-3
                rounded-full
                border
                border-[#6E82A6]
                text-white
                font-semibold
                hover:bg-white/10
                transition-all
                duration-300
              "
            >
              Admin Login
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <svg width="28" height="28" viewBox="0 0 24 24">
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24">
                <path
                  d="M4 7H20M4 12H20M4 17H20"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="
              md:hidden
              mt-4
              rounded-3xl
              bg-[#163454]/95
              backdrop-blur-2xl
              border
              border-white/10
              p-6
            "
          >
            <div className="flex flex-col gap-5">
              <a
                href="#search"
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-[#8FD2FF]"
              >
                Check Results
              </a>

              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-[#8FD2FF]"
              >
                About
              </a>

              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-[#8FD2FF]"
              >
                Contact
              </a>

              <a
                href="/admin/login"
                className="
                  text-center
                  rounded-full
                  border
                  border-[#6E82A6]
                  py-3
                  text-white
                  font-semibold
                  hover:bg-white/10
                  transition
                "
              >
                Admin Login
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}