import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 0,
    file: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleRating = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        rating: 0,
        file: null
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-[#1e3a5f] text-white py-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We'd love to hear from you! Send us a message and we'll respond as
            soon as possible.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">

          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-10">
            {isSubmitted && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8 rounded">
                <p className="font-medium">Thank you for your feedback!</p>
                <p>
                  We've received your message and will get back to you soon.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="form-group">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label
                  htmlFor="subject"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300"
                  placeholder="How can we help?"
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300"
                  placeholder="Tell us more about your inquiry..."
                  required
                ></textarea>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:-translate-y-0.5 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
