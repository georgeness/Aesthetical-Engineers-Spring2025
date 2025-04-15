"use client";
import React, { FormEvent, useState } from "react";

export const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Form validation
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (!message.trim()) {
      setError("Please enter your message");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }
      
      // Clear form and show success message
      setName("");
      setEmail("");
      setMessage("");
      setSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={onSubmit} 
      className="w-full max-w-md p-9 border border-gray-300 rounded-lg shadow-md"
    >
      {submitted ? (
        <div className="text-center py-8">
          <div className="text-green-600 text-center font-medium p-4 bg-green-50 rounded-lg mb-4">
            Message sent successfully! We'll get back to you soon.
          </div>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-all"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter your name"
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              rows={4}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              disabled={isSubmitting}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 font-medium rounded-md transition-all ${
              isSubmitting 
                ? "bg-gray-400 text-white cursor-not-allowed" 
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Sending..." : "Submit"}
          </button>
        </>
      )}
    </form>
  );
};
