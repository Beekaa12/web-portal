import React, { memo, useCallback, useEffect, useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaUserTie,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa";

const members = [
  {
    id: 1,
    name: "Tucho Biratu",
    role: "Full Stack Developer",
    about: "Builds responsive interfaces and keeps the user journey smooth.",
    email: "Tucho.Biratu@iu.edu.et",
    phone: "+251 911 223 344",
    linkedin: "https://www.linkedin.com/in/tucho12",
    portfolio: "https://tucho-biratu.vercel.app/",
    image: "https://tucho-biratu.vercel.app/Tucho.png",
  },
  {
    id: 2,
    name: "Jiregna Worku",
    role: "Full Stack Developer",
    about: "Designs secure APIs and reliable backend services.",
    email: "jiregna.worku@iu.edu.et",
    phone: "+251 922 334 455",
    linkedin: "https://www.linkedin.com/in/jiregna-worku",
    portfolio: "https://jiregnaworku.vercel.app/",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQEiLD10LLqcnA/profile-displayphoto-shrink_200_200/B4DZW3jmbgHIAY-/0/1742541318878?e=2147483647&v=beta&t=K_2sXKufd_aL0u4KS65LcCn5cZhf_OeFHILJ9Ew-drw",
  },
  {
    id: 3,
    name: "Amanuel Sisay",
    role: "UI/UX Designer",
    about: "Creates intuitive visual systems and clean product experiences.",
    email: "amanuel.sisay@iu.edu.et",
    phone: "+251 933 445 566",
    linkedin: "https://www.linkedin.com",
    portfolio: "https://dawit-portfolio.dev",
    image: "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
  },
  {
    id: 4,
    name: "Ahmed Kassaye",
    role: "QA Engineer",
    about: "Ensures quality through test coverage and proactive validation.",
    email: "ahmed.kassaye@iu.edu.et",
    phone: "+251 944 556 677",
    linkedin: "https://www.linkedin.com",
    portfolio: "https://meron-portfolio.dev",
    image: "https://cdn-icons-png.flaticon.com/512/9187/9187604.png",
  },
  {
    id: 5,
    name: "Habtamu Biks",
    role: "Project Coordinator",
    about: "Coordinates planning, communication, and on-time execution.",
    email: "habtamu.biks@iu.edu.et",
    phone: "+251 955 667 788",
    linkedin: "https://www.linkedin.com",
    portfolio: "https://henok-portfolio.dev",
    image: "https://thumbs.dreamstime.com/faces/1674243916AQ6.jpg",
  },
];

const teamHighlights = [
  "Free to use",
  "Desktop + mobile versions",
  "layout styles included",
  "Built with Auto Layout",
];

const MemberCard = memo(function MemberCard({ member, onSelectMember }) {
  return (
    <div className="group flex flex-col sm:flex-row bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-2 hover:-translate-y-1 hover:shadow-lg hover:border-sky-200 transition-all duration-300">
      <div className="w-full sm:w-32 flex-shrink-0 flex flex-col">
        <button
          type="button"
          onClick={() => onSelectMember(member)}
          className="rounded-[8px] overflow-hidden focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-zoom-in"
          aria-label={`View full photo of ${member.name}`}
        >
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="w-full h-72 sm:w-32 sm:h-32 object-cover object-top sm:object-contain sm:object-center bg-slate-50 scale-100 sm:scale-100 group-hover:scale-105 transition-transform duration-300"
          />
        </button>
        <div className="mt-2 flex items-center justify-center gap-2">
          <a
            href={member.linkedin}
            target="_blank"
            rel="noreferrer"
            title="LinkedIn account"
            className="h-7 w-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition"
            aria-label={`${member.name} LinkedIn`}
          >
            <FaLinkedin className="text-[12px]" />
          </a>
          <a
            href={member.portfolio}
            target="_blank"
            rel="noreferrer"
            title="Go to portfolio"
            className="h-7 w-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 transition"
            aria-label={`${member.name} Portfolio`}
          >
            <FaGlobe className="text-[12px]" />
          </a>
        </div>
      </div>

      <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between min-[1100px]:max-[1400px]:flex-col min-[1100px]:max-[1400px]:items-start gap-1 sm:gap-2 mb-2">
            <h4 className="sm:flex-1 text-lg font-bold text-gray-800">
              {member.name}
            </h4>

            <span className="flex items-center gap-1 text-sm font-medium text-blue-600 capitalize whitespace-nowrap">
              <FaUserTie className="text-xs" />
              {member.role}
            </span>
          </div>

          <p className="text-[13px] text-slate-600 mb-2 leading-relaxed break-words">
            {member.about}
          </p>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2 text-[12px] text-slate-600">
              <FaPhoneAlt className="text-[11px] text-blue-500" />
              <span>{member.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-slate-600 min-w-0">
              <FaEnvelope className="text-[11px] text-blue-500" />
              <span className="truncate">{member.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const MemberPhotoModal = memo(function MemberPhotoModal({
  selectedMember,
  onClose,
}) {
  if (!selectedMember) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Member photo modal for ${selectedMember.name}`}
    >
      <div
        className="relative inline-flex max-w-full max-h-[92vh]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute top-2 right-2 text-black text-3xl leading-none px-2"
          onClick={onClose}
          aria-label="Close photo modal"
        >
          ×
        </button>

        <img
          src={selectedMember.image}
          alt={selectedMember.name}
          decoding="async"
          className="max-w-full max-h-[92vh] object-contain"
        />
      </div>
    </div>
  );
});

const GroupMember = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const openMemberModal = useCallback((member) => {
    setSelectedMember(member);
  }, []);
  const closeMemberModal = useCallback(() => {
    setSelectedMember(null);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMemberModal();
      }
    };

    if (selectedMember) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedMember, closeMemberModal]);

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <section className="relative bg-[#1e3a5f] text-white py-20">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Group Members</h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto">
            Meet Team Group 5, the students behind the cooperative web portal
            and digital sacco services.
          </p>
        </div>
      </section>

      <section className="">
        <div className="my-6 flex flex-col md:flex-row w-full">
          {/* LEFT SIDE */}
          <div className="md:w-1/3 bg-white p-8 md:p-10 flex flex-col justify-center shadow-sm rounded-2xl">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Meet The Team
            </h2>

            <p className="text-slate-500 mb-6 leading-relaxed text-[15px]">
              Our team delivers high-quality solutions with modern tools and
              clean design principles.
            </p>

            <ul className="space-y-4">
              {teamHighlights.map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 hover:border-sky-200 hover:bg-sky-50/40 transition"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-sm font-bold">
                    ✓
                  </span>
                  <span className="text-[15px]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* RIGHT SIDE */}
          <div className="md:w-2/3 p-8 md:p-10">
            <div className="mb-10 items-center text-center">
              <h3 className="text-3xl font-semibold text-gray-900 mb-3">
                The People Behind the Work
              </h3>
              <p className="text-gray-500 text-xl text-[15px]">
                We believe in collaboration, clear communication, and delivering
                results through strong teamwork.
              </p>
            </div>

            {/* TEAM GRID (2 COL) */}
            <div className="grid grid-cols-1 min-[1100px]:grid-cols-2 gap-6 mt-10">
              {members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onSelectMember={openMemberModal}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <MemberPhotoModal
        selectedMember={selectedMember}
        onClose={closeMemberModal}
      />
    </div>
  );
};

export default GroupMember;
