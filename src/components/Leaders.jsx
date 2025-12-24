import React from 'react';

const leaders = [
  {
    id: 1,
    name: 'John Mwangi',
    position: 'Chairman',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Over 15 years of experience in financial management and leadership roles.'
  },
  {
    id: 2,
    name: 'Sarah Wanjiku',
    position: 'Vice Chairman',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Expert in cooperative management with a passion for community development.'
  },
  {
    id: 3,
    name: 'David Ochieng',
    position: 'Treasurer',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
    bio: 'Certified accountant with extensive experience in financial planning.'
  },
  {
    id: 4,
    name: 'Grace Akinyi',
    position: 'Secretary',
    image: 'https://randomuser.me/api/portraits/women/63.jpg',
    bio: 'Dedicated to transparent communication and efficient administration.'
  }
];

const Leaders = () => {
  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1e3a5f] mb-2">Our Leaders</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Meet the dedicated team leading our SACCO towards a brighter financial future for all members.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {leaders.map((leader) => (
            <div key={leader.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="h-48 bg-blue-100 flex items-center justify-center">
                <img 
                  src={leader.image} 
                  alt={leader.name} 
                  className="w-32 h-32 rounded-full border-4 border-white shadow-md"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800">{leader.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{leader.position}</p>
                <p className="text-gray-600 text-sm">{leader.bio}</p>
                <div className="mt-4 flex justify-center space-x-3">
                  <a href="#" className="text-blue-500 hover:text-blue-700">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-blue-500 hover:text-blue-700">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leaders;
