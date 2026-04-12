import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, HelpCircle } from 'lucide-react';

export default function SubscriptionPlans() {
  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses getting started.',
      price: '$29',
      period: '/mo',
      buttonText: 'Get Starter'
    },
    {
      name: 'Professional',
      description: 'Ideal for growing brands.',
      price: '$99',
      period: '/mo',
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
    <section className="pt-8 pb-24 bg-black relative overflow-hidden border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-semibold text-white mb-3">Pricing</h2>
          <p className="text-white/30 text-sm">Start free. Scale as you grow.</p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              key={plan.name}
              className={`rounded-xl p-6 flex flex-col border transition-colors ${
                plan.highlight
                  ? 'bg-[#5282E1] border-[#5282E1]'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/15'
              }`}
            >
              <h3 className={`text-base font-semibold mb-0.5 ${plan.highlight ? 'text-white' : 'text-white'}`}>{plan.name}</h3>
              <p className={`text-xs mb-6 ${plan.highlight ? 'text-white/70' : 'text-white/30'}`}>{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-6 mt-auto">
                <span className={`text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-white'}`}>{plan.price}</span>
                <span className={`text-xs ${plan.highlight ? 'text-white/60' : 'text-white/30'}`}>{plan.period}</span>
              </div>

              <button className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                plan.highlight
                  ? 'bg-white text-[#5282E1] hover:bg-white/90'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}>
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Comparison */}
        <div className="hidden md:block border border-white/10 rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
            <div className="text-white/30 text-xs font-medium uppercase tracking-wider">Features</div>
            {plans.map(plan => (
              <div key={plan.name} className={`text-sm font-medium pl-2 ${plan.highlight ? 'text-[#5282E1]' : 'text-white/50'}`}>
                {plan.name}
              </div>
            ))}
          </div>

          <div className="divide-y divide-white/5">
            {features.map((feature, idx) => (
              <div key={idx} className="grid grid-cols-4 gap-4 px-6 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/50">{feature.name}</span>
                  {feature.hasTooltip && <HelpCircle className="w-3 h-3 text-white/15" />}
                </div>
                {feature.values.map((val, vIdx) => (
                  <div key={vIdx} className="flex items-center pl-2">
                    {val === 'yes' ? (
                      <CheckCircle2 className="w-4 h-4 text-[#5282E1]" />
                    ) : val === 'no' ? (
                      <span className="text-white/15">—</span>
                    ) : (
                      <span className="text-xs font-medium text-white/50">{val}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
