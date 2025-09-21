'use client'
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      question: "How do I search for projects?",
      answer: "Use our search bar to find projects by technology stack, programming language, or keywords. You can filter by categories like web, mobile, AI, or networking."
    },
    {
      question: "Do I need an account to browse projects?",
      answer: "No, you can browse projects freely. However, you need an account to submit projects, join discussions, or write blog posts."
    },
    {
      question: "How do I submit my own project?",
      answer: "After logging in, click the 'Submit Project' button. Fill in your project details, GitHub link, tech stack, and category. Projects are usually approved within 24-48 hours."
    },
    {
      question: "Can I participate in discussions?",
      answer: "Yes! Every project has a discussion section where you can ask questions, share feedback, and connect with other developers."
    },
    {
      question: "What can I write about in the blog section?",
      answer: "Share your development journey, project experiences, tutorials, or any tech-related insights that would help the community."
    },
    {
      question: "Is the platform free to use?",
      answer: "Absolutely! Our platform is 100% free and open source. No hidden fees or premium subscriptions required."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Quick answers to common questions about our platform
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openItems[index];
            return (
              <div
                key={index}
                className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-5 text-left hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {item.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center bg-blue-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Need more help?
          </h3>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Join our community discussions or reach out for support.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;