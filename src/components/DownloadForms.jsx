import React from 'react';

const DownloadForms = () => {
  // These would be the actual paths to your PDF files in the public folder
  const forms = [
    {
      id: 1,
      title: 'Membership Application Form',
      description: 'Download and fill out this form to apply for SACCO membership.',
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      fileName: 'membership-application-form.pdf',
      lastUpdated: 'Updated: October 15, 2023'
    },
    {
      id: 2,
      title: 'Loan Application Form',
      description: 'Apply for a SACCO loan by downloading and completing this form.',
      icon: (
        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      fileName: 'loan-application-form.pdf',
      lastUpdated: 'Updated: November 5, 2023'
    },
    {
      id: 3,
      title: 'Account Update Form',
      description: 'Update your personal or account information using this form.',
      icon: (
        <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      fileName: 'account-update-form.pdf',
      lastUpdated: 'Updated: September 20, 2023'
    },
    {
      id: 4,
      title: 'Withdrawal Form',
      description: 'Request a withdrawal from your SACCO account.',
      icon: (
        <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      fileName: 'withdrawal-form.pdf',
      lastUpdated: 'Updated: October 1, 2023'
    }
  ];

  const handleDownload = (fileName) => {
    // In a real app, this would trigger a download of the actual PDF file
    // For now, we'll just log which file would be downloaded
    console.log(`Downloading ${fileName}`);
    
    // In a real implementation, you would do something like:
    // const link = document.createElement('a');
    // link.href = `/forms/${fileName}`;
    // link.download = fileName;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-[#1e3a5f] text-white py-20">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Download Forms</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Access and download the necessary forms for your SACCO transactions and applications
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {forms.map((form) => (
            <div 
              key={form.id} 
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col border border-gray-100"
            >
              <div className="p-6 flex-grow">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {form.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{form.title}</h3>
                    <p className="text-gray-600 mb-4">{form.description}</p>
                    <p className="text-sm text-gray-500">{form.lastUpdated}</p>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6">
                <button
                  onClick={() => handleDownload(form.fileName)}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Form
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Note:</span> After downloading, please print and fill out the form, then submit it to any of our branches or email it to <span className="font-medium">documents@sacco.co.ke</span>
              </p>
            </div>
          </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DownloadForms;
