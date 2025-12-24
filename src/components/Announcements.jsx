import React, { useState } from 'react';

const announcements = [
  {
    id: 1,
    title: 'Annual General Meeting 2024',
    date: '2024-03-15',
    excerpt: 'Join us for our most important event of the year where we will review our achievements and set the course for the future.',
    category: 'Meeting',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    content: `
      <p>We are excited to invite all our valued members to our Annual General Meeting 2024. This is a crucial event where we will:</p>
      <ul class="list-disc pl-5 mt-2 space-y-1">
        <li>Review the financial performance of the past year</li>
        <li>Present the audited financial statements</li>
        <li>Elect new board members</li>
        <li>Discuss and approve the annual budget</li>
        <li>Share our strategic plan for the coming year</li>
      </ul>
      <p class="mt-3">Date: March 15, 2024<br>
      Time: 9:00 AM - 2:00 PM<br>
      Venue: SACCO Headquarters, Main Hall</p>
      <p class="mt-2">Lunch and refreshments will be served. Please confirm your attendance by March 10th.</p>
    `
  },
  {
    id: 2,
    title: 'New Loan Products Launch',
    date: '2024-03-10',
    excerpt: 'Introducing our new range of loan products designed to meet all your financial needs with competitive rates.',
    category: 'Update',
    image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    content: `
      <p>We're excited to announce our new loan products tailored to help you achieve your financial goals:</p>
      <div class="mt-3 space-y-3">
        <div class="bg-blue-50 p-3 rounded-lg">
          <h4 class="font-semibold text-blue-800">Business Expansion Loan</h4>
          <p class="text-sm text-gray-700">Up to Ksh 5,000,000 at 12% p.a. with flexible repayment terms up to 36 months.</p>
        </div>
        <div class="bg-green-50 p-3 rounded-lg">
          <h4 class="font-semibold text-green-800">School Fees Loan</h4>
          <p class="text-sm text-gray-700">Get up to Ksh 200,000 for school fees at 10% p.a. with repayment up to 12 months.</p>
        </div>
        <div class="bg-purple-50 p-3 rounded-lg">
          <h4 class="font-semibold text-purple-800">Asset Financing</h4>
          <p class="text-sm text-gray-700">Finance up to 80% of the asset value at competitive rates.</p>
        </div>
      </div>
      <p class="mt-3">Visit any of our branches or contact our customer care for more information.</p>
    `
  },
  {
    id: 3,
    title: 'Easter Holiday Notice',
    date: '2024-04-01',
    excerpt: 'Important information about our operating hours during the upcoming Easter holidays.',
    category: 'Notice',
    image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80',
    content: `
      <p>Please be informed of our operating hours during the Easter holiday period:</p>
      <div class="mt-3 space-y-2">
        <div class="flex justify-between border-b pb-1">
          <span>Good Friday (April 7):</span>
          <span class="font-medium">Closed</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span>Holy Saturday (April 8):</span>
          <span class="font-medium">9:00 AM - 1:00 PM</span>
        </div>
        <div class="flex justify-between border-b pb-1">
          <span>Easter Sunday (April 9):</span>
          <span class="font-medium">Closed</span>
        </div>
        <div class="flex justify-between">
          <span>Easter Monday (April 10):</span>
          <span class="font-medium">10:00 AM - 2:00 PM</span>
        </div>
      </div>
      <p class="mt-4">Our digital banking services will remain available 24/7 during this period. We apologize for any inconvenience caused.</p>
    `
  }
];

const Announcements = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Meeting':
        return 'bg-blue-100 text-blue-800';
      case 'Update':
        return 'bg-green-100 text-green-800';
      case 'Notice':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-[#1e3b5f] text-white py-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Announcements</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Stay updated with the latest news and important updates from our
            SACCO
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full border border-gray-100"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={announcement.image}
                    alt={announcement.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryColor(
                        announcement.category
                      )}`}
                    >
                      {announcement.category}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      {new Date(announcement.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {announcement.excerpt}
                  </p>
                  <button
                    onClick={() => openModal(announcement)}
                    className="mt-auto inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group transition-colors"
                  >
                    Read Full Announcement
                    <svg
                      className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-[#1e3a5f] text-white rounded-full font-medium hover:bg-opacity-90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center mx-auto group">
              View All Announcements
              <svg
                className="w-4 h-4 ml-2 transition-transform group-hover:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Announcement Modal */}
        {isModalOpen && selectedAnnouncement && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 md:h-80">
                <img
                  src={selectedAnnouncement.image}
                  alt={selectedAnnouncement.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
                >
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap justify-between items-center mb-4">
                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${getCategoryColor(
                      selectedAnnouncement.category
                    )}`}
                  >
                    {selectedAnnouncement.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(selectedAnnouncement.date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  {selectedAnnouncement.title}
                </h2>
                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: selectedAnnouncement.content,
                  }}
                />
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    For more information, please contact our customer care at{" "}
                    <a
                      href="tel:+254700000000"
                      className="text-blue-600 hover:underline"
                    >
                      +254 700 000000
                    </a>{" "}
                    or email{" "}
                    <a
                      href="mailto:info@sacco.co.ke"
                      className="text-blue-600 hover:underline"
                    >
                      info@sacco.co.ke
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Announcements;
