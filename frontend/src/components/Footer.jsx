import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto p-6 md:py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <a href="/" className="flex items-center space-x-3">
          
          <span className="text-xl font-semibold text-[#1F2937]">TAG.IN</span>
        </a>
        <ul className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500">
          <li><a href="#" className="hover:underline">About</a></li>
          <li><a href="#" className="hover:underline">Privacy Policy</a></li>
          <li><a href="#" className="hover:underline">Licensing</a></li>
          <li><a href="#" className="hover:underline">Contact</a></li>
        </ul>
      </div>
      <div className="border-t border-gray-200 text-center text-sm text-gray-500 py-4">
        © 2025 TAG.IN. All Rights Reserved.
      </div>
    </footer>
  );
}
