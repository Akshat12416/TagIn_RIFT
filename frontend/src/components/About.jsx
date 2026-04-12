import React from 'react';

export default function About() {
  const features = [
    { title: 'Tiny NFC in every genuine unit', desc: 'Embed a tiny RFID/NFC chip at manufacturing so each item gets a unique hardware identity.' },
    { title: 'Secured on blockchain', desc: 'Bind that chip`s UID to an immutable on-chain record—creating an unchangeable digital ID.' },
    { title: 'Tap to verify', desc: 'Consumers simply tap with an NFC-enabled phone—no app needed—to get instant, on-chain proof.' },
    { title: 'Component-level checks', desc: 'Support part-by-part verification: verify internal components inside complex devices.' },
    { title: 'NFT ownership', desc: 'Each product can carry an NFT certificate enabling verified resale and transfers.' },
    { title: 'Revoke fakes in real time', desc: 'Manufacturers can revoke a counterfeit tag immediately and warn future buyers.' },
  ];

  return (
    <section id="how" className="py-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-gradient-to-b from-white to-[#f0f4fa] border border-[#e3eaf5] rounded-2xl shadow-md p-8 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="font-bold text-lg text-[#1F2937] mb-3">
              {f.title}
            </div>
            <div className="text-[#7a8ca5] leading-relaxed">
              {f.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
