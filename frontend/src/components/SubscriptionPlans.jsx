import React from 'react';
import { FiCheck } from 'react-icons/fi';

export default function SubscriptionPlans() {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/ month',
      description: 'Perfect for small businesses getting started',
      features: [
        'Up to 100 products/month',
        'Basic NFC chip integration',
        'Blockchain verification',
        'Mobile verification app',
        'Email support'
      ],
      buttonText: 'Your current plan',
      buttonStyle: 'inactive',
      popular: false
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/ month',
      description: 'Ideal for growing brands',
      features: [
        'Including all starter features',
        'Up to 1,000 products/month',
        'Advanced NFC + QR codes',
        'API access',
        'Priority support',
        'Advanced analytics'
      ],
      buttonText: 'Upgrade to Professional',
      buttonStyle: 'active',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large manufacturers and global brands',
      features: [
        'Including all professional features',
        'Unlimited products',
        'Component-level verification',
        'Private blockchain deployment',
        'Dedicated account manager',
        'Custom integrations'
      ],
      buttonText: 'Contact Sales',
      buttonStyle: 'active',
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the perfect anti-counterfeit solution for your business needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                plan.popular 
                  ? 'border-2 border-transparent bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={plan.popular ? {
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderImage: 'linear-gradient(135deg, #8b5cf6, #ec4899) 1'
              } : {}}
            >
              <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <FiCheck className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 ml-1 text-lg">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 px-6 rounded-full font-medium text-sm transition-all duration-300 ${
                    plan.buttonStyle === 'active'
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-100 text-gray-600 cursor-default'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>

              {/* Gradient border for popular plan */}
              {plan.popular && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 p-[2px] -z-10">
                  <div className="bg-white rounded-2xl h-full w-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            All plans include 24/7 support and a 30-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
}