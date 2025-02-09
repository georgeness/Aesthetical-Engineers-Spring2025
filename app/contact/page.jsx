// app/contact/page.jsx
import React from 'react';

const Contact = () => (
  <section className="w-full flex-center flex-col p-4">
    <h1 className="head_text text-center mb-4">Contact</h1>
    <p className="desc text-center mb-2">
      For inquiries or further information, please reach out to us.
    </p>
    <p className="text-center">
      <strong>Email:</strong> <a href="mailto:george.lupo.app@gmail.com" className="text-blue-500">george.lupo.app@gmail.com</a>
    </p>
    <p className="text-center">
      <strong>Website:</strong> <a href="https://georgelupo.com" className="text-blue-500" target="_blank" rel="noopener noreferrer">georgelupo.com</a>
    </p>
    <p className="text-center">
      <strong>Phone:</strong> <a href="tel:(561)628-6930" className="text-blue-500">(561)628-6930</a>
    </p>
    <p className="text-center mt-6 italic text-sm">
      All prices of my colorful paintings include free shipping to anywhere in the continental United States.
    </p>
  </section>
);

export default Contact;
