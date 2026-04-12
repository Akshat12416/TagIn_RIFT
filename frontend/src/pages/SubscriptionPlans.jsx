import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, HelpCircle } from 'lucide-react';

export default function SubscriptionPlans() {
  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses getting started.',
      price: '$29',
      period: 'per month',
      buttonText: 'Get Starter'
    },
    {
      name: 'Professional',
      description: 'Ideal for growing brands.',
      price: '$99',
      period: 'per month',
      buttonText: 'Upgrade to PRO',
      highlight: true
    },
    {
      name: 'Enterprise',
      description: 'For large manufacturers.',
      price: 'Custom',
      period: '',
      buttonText: 'Contact Sales'
    }
  ];

  const features = [
    { name: 'Products / Month', values: ['Up to 100', 'Up to 1,000', 'Unlimited'] },
    { name: 'Basic NFC chip integration', hasTooltip: true, values: ['yes', 'yes', 'yes'] },
    { name: 'Blockchain verification', hasTooltip: true, values: ['yes', 'yes', 'yes'] },
    { name: 'Mobile verification app', values: ['yes', 'yes', 'yes'] },
    { name: 'Advanced QR Codes', hasTooltip: true, values: ['no', 'yes', 'yes'] },
    { name: 'API Access', values: ['no', 'yes', 'yes'] },
    { name: 'Advanced Analytics', hasTooltip: true, values: ['no', 'yes', 'yes'] },
    { name: 'Private blockchain deployment', hasTooltip: true, values: ['no', 'no', 'yes'] }
  ];

  return (
    <section className="pt-4 pb-24 bg-black text-white relative overflow-hidden font-['ClashDisplay'] border-t border-white/10">

      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5282E1]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#5282E1]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">

        {/* Pill */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#5282E1]/30 bg-[#5282E1]/10 text-sm font-bold text-[#5282E1]">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5282E1]"></span>
              Tag-In V2.0 is live
            </span>
            <a href="#" className="flex items-center gap-1 text-white/60 hover:text-white transition underline underline-offset-2 decoration-white/20">
              Read <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-5xl font-extrabold tracking-tight mb-6">
            Pricing plans
          </h2>
          <p className="text-xl text-white/50 font-medium">
            Try our starter plan risk free for 30 days. Scale as you grow.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1 rounded-xl bg-white/5 border border-white/10">
            <button className="px-5 py-2 rounded-lg bg-white/10 text-white text-sm font-bold border border-white/10">
              Annual pricing
            </button>
            <button className="px-5 py-2 rounded-lg text-white/40 hover:text-white text-sm font-bold transition-colors">
              Monthly pricing
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
          {plans.map((plan, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col border transition-all ${
                plan.highlight
                  ? 'bg-[#5282E1] border-[#5282E1] shadow-[0_0_60px_rgba(82,130,225,0.3)] md:-translate-y-2'
                  : 'bg-[#111111] border-white/10 hover:border-white/20'
              }`}
            >
              <h3 className={`text-xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-white'}`}>{plan.name}</h3>
              <p className={`text-sm mb-8 ${plan.highlight ? 'text-blue-100' : 'text-white/40'}`}>{plan.description}</p>

              <div className="flex items-end gap-2 mb-8 mt-auto">
                <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                <span className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-blue-100' : 'text-white/40'}`}>{plan.period}</span>
              </div>

              <button className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all mt-4 ${
                plan.highlight
                  ? 'bg-white text-[#5282E1] hover:bg-blue-50'
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
              }`}>
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="hidden md:block max-w-5xl mx-auto border-t border-white/10 pt-16">
          <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b border-white/10">
            <div className="font-bold text-white/40 text-xs col-span-1 uppercase tracking-widest">Features</div>
            {plans.map(plan => (
              <div key={plan.name} className={`font-bold text-sm col-span-1 pl-4 ${plan.highlight ? 'text-[#5282E1]' : 'text-white/70'}`}>
                {plan.name}
              </div>
            ))}
          </div>

          <div className="space-y-0">
            {features.map((feature, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-4 py-5 border-b border-white/5 hover:bg-white/5 transition-colors rounded-xl px-2">
                <div className="col-span-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-white/60">{feature.name}</span>
                  {feature.hasTooltip && (
                    <HelpCircle className="w-3.5 h-3.5 text-white/20" />
                  )}
                </div>

                {feature.values.map((val, vIdx) => (
                  <div key={vIdx} className="col-span-1 flex items-center pl-4">
                    {val === 'yes' ? (
                      <CheckCircle2 className="w-5 h-5 text-[#5282E1]" />
                    ) : val === 'no' ? (
                      <span className="text-white/20 font-bold">—</span>
                    ) : (
                      <span className="text-sm font-semibold text-white/70">{val}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-12 mb-4">
            <h3 className="font-bold text-white/30 text-xs uppercase tracking-widest">Hardware & Infrastructure</h3>
          </div>
        </div>

      </div>
    </section>
  );
}
