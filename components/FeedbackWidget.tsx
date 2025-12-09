"use client";

import { useState } from "react";

export function FeedbackWidget() {
  const [feedback, setFeedback] = useState<boolean | null>(null);

  const handleFeedback = (value: boolean) => {
    setFeedback(value);
  };

  if (feedback !== null) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center">
        <p className="text-gray-700">
          {feedback ? "Thanks for the positive vibes! 🎉" : "Thanks for your feedback! 💭"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <p className="text-gray-800 font-medium mb-4 text-center">
        Was this verse catchy? 🎵
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => handleFeedback(true)}
          className="px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-label="Yes, the verse was catchy"
        >
          👍 Yes
        </button>
        <button
          onClick={() => handleFeedback(false)}
          className="px-8 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="No, the verse was not catchy"
        >
          👎 No
        </button>
      </div>
    </div>
  );
}

