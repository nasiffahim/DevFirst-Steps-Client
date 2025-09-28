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
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6 transition-colors duration-300">
            <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300">
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
                className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md dark:hover:shadow-xl dark:hover:shadow-gray-900/20 transition-all duration-200"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4 transition-colors duration-300">
                      {item.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-colors duration-300" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 transition-colors duration-300" />
                      )}
                    </div>
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 border border-transparent dark:border-blue-800/30 transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
            Need more help?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">
            Can't find what you're looking for? Join our community discussions or reach out for support.
          </p>
          <button className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-50 dark:focus:ring-offset-blue-900/20">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;