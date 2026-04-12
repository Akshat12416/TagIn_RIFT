import React from 'react';
import { Link } from 'react-router-dom';
import RotatingTextWithBorder from './RotatingTextWithBorder';

export default function Hero() {
  return (
    <section className="text-center pt-28 pb-40">
      <div className="max-w-5xl mx-auto px-8">
        <div className="inline-block px-5 py-2 mb-6 rounded-full border-2 border-[#6aa9ff] bg-[#eaf3ff] font-bold">
          TAG-IN NFC Anti-Counterfeit
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold text-[#1F2937] leading-tight mb-6">
          Authenticate any{''}
          <RotatingTextWithBorder
            texts={["Sneakers", "Handbag", "Watch"]}
            rotationInterval={2500}
          />{' '} <div></div>
          with just a Tap.
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Embed an NFC chip, link it to tamper-proof blockchain records, and give buyers instant trust from their phone—no app required.
        </p>

        <div className="flex justify-center gap-5">
          <Link
            to="/login"
            className="px-8 py-3 rounded-full font-bold text-white bg-gray-800 shadow hover:brightness-110 hover:-translate-y-0.5 transform transition"
          >
            Get Started
          </Link>
          <a
            href="#how"
            className="px-8 py-3 rounded-full font-bold text-[#1F2937] border-2 border-gray-800 bg-transparent hover:bg-[#eaf3ff] transition"
          >
            How it works
          </a>
        </div>
      </div>
    </section>
  );
}