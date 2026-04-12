import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sm font-semibold text-white/40">TAG-IN</span>
        <ul className="flex flex-wrap items-center gap-6 text-xs text-white/20">
          <li><a href="#" className="hover:text-white/50 transition-colors">About</a></li>
          <li><a href="#" className="hover:text-white/50 transition-colors">Privacy</a></li>
          <li><a href="#" className="hover:text-white/50 transition-colors">Licensing</a></li>
          <li><a href="#" className="hover:text-white/50 transition-colors">Contact</a></li>
        </ul>
      </div>
      <div className="border-t border-white/5 text-center text-[11px] text-white/15 py-5">
        © 2025 TAG-IN. All Rights Reserved.
      </div>
    </footer>
  );
}
