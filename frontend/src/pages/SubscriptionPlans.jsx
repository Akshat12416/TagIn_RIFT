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
      buttonText: 'Upgrade to PRO'
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
    {
      name: 'Products / Month',
      hasTooltip: false,
      values: ['Up to 100', 'Up to 1,000', 'Unlimited']
    },
    {
      name: 'Basic NFC chip integration',
      hasTooltip: true,
      values: ['yes', 'yes', 'yes']
    },
    {
      name: 'Blockchain verification',
      hasTooltip: true,
      values: ['yes', 'yes', 'yes']
    },
    {
      name: 'Mobile verification app',
      hasTooltip: false,
      values: ['yes', 'yes', 'yes']
    },
    {
      name: 'Advanced QR Codes',
      hasTooltip: true,
      values: ['no', 'yes', 'yes']
    },
    {
      name: 'API Access',
      hasTooltip: false,
      values: ['no', 'yes', 'yes']
    },
    {
      name: 'Advanced Analytics',
      hasTooltip: true,
      values: ['no', 'yes', 'yes']
    },
    {
      name: 'Private blockchain deployment',
      hasTooltip: true,
      values: ['no', 'no', 'yes']
    }
  ];

  return (
    <section className="pt-4 pb-20 bg-[#f8faff] text-gray-900 relative overflow-hidden font-sans border-t border-gray-100">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Top Notification Pill */}
        <div className="flex justify-center mb-8">
           <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-100/50 text-sm font-bold text-blue-700">
              <span className="flex items-center gap-2">
                 <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                 Tag-In V2.0 is live
              </span>
              <a href="#" className="flex items-center gap-1 text-blue-800 hover:text-blue-900 transition-colors underline decoration-blue-300 underline-offset-2">
                 Read <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
           </div>
        </div>

        {/* Header section */}
        <div className="mb-10 text-center mx-auto">
          <h2 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            Pricing plans
          </h2>
          <p className="text-xl text-gray-600 font-medium">
            Try our starter plan risk free for 30 days. Scale as you grow.
          </p>
        </div>

        {/* Toggle (Annual vs Monthly) */}
        <div className="flex justify-center mb-16">
           <div className="inline-flex p-1 rounded-xl bg-gray-100 border border-gray-200">
              <button className="px-5 py-2 rounded-lg bg-white text-gray-900 text-sm font-bold shadow-sm border border-gray-200">
                 Annual pricing
              </button>
              <button className="px-5 py-2 rounded-lg text-gray-500 hover:text-gray-900 text-sm font-bold transition-colors">
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
              className={`border rounded-2xl p-8 flex flex-col shadow-sm ${plan.name === 'Professional' ? 'bg-blue-600 border-blue-600 text-white shadow-xl transform md:-translate-y-2' : 'bg-white border-gray-200'}`}
            >
               <h3 className={`text-xl font-bold mb-1 ${plan.name === 'Professional' ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
               <p className={`text-sm mb-8 ${plan.name === 'Professional' ? 'text-blue-100' : 'text-gray-500'}`}>{plan.description}</p>
               
               <div className="flex items-end gap-2 mb-8 mt-auto">
                  <span className={`text-5xl font-black tracking-tighter ${plan.name === 'Professional' ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                  <span className={`text-sm font-semibold mb-1 ${plan.name === 'Professional' ? 'text-blue-100' : 'text-gray-500'}`}>{plan.period}</span>
               </div>
               
               <button className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-colors mt-4 ${plan.name === 'Professional' ? 'bg-white text-blue-600 hover:bg-gray-50 shadow-md' : 'bg-gray-50 border border-gray-200 text-gray-900 hover:bg-gray-100'}`}>
                  {plan.buttonText}
               </button>
            </motion.div>
          ))}
        </div>

        {/* Desktop Feature Comparison Table */}
        <div className="hidden md:block max-w-5xl mx-auto border-t border-gray-200 pt-16">
           {/* Table Header */}
           <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-200">
              <div className="font-bold text-gray-900 text-sm col-span-1">Features</div>
              {plans.map(plan => (
                 <div key={plan.name} className="font-bold text-gray-900 text-sm col-span-1 pl-4">
                    {plan.name}
                 </div>
              ))}
           </div>

           {/* Table Body */}
           <div className="space-y-0">
              {features.map((feature, idx) => (
                 <div key={idx} className="grid grid-cols-4 gap-4 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    {/* Feature Name */}
                    <div className="col-span-1 flex items-center gap-2">
                       <span className="text-sm font-bold text-gray-700">{feature.name}</span>
                       {feature.hasTooltip && (
                          <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                       )}
                    </div>
                    
                    {/* Feature Values */}
                    {feature.values.map((val, vIdx) => (
                       <div key={vIdx} className="col-span-1 flex items-center pl-4">
                          {val === 'yes' ? (
                             <CheckCircle2 className="w-5 h-5 text-blue-600" />
                          ) : val === 'no' ? (
                             <span className="text-gray-400 font-bold">—</span>
                          ) : (
                             <span className="text-sm font-semibold text-gray-600">{val}</span>
                          )}
                       </div>
                    ))}
                 </div>
              ))}
           </div>

           {/* Core Infrastructure Section Header Example */}
           <div className="mt-12 mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Hardware & Infrastructure</h3>
           </div>
        </div>

      </div>
    </section>
  );
}
