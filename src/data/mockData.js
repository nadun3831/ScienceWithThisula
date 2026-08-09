// Mock Data for ScienceWithThisula LMS Platform

export const LECTURER_INFO = {
  name: "Lecturer Thisula",
  title: "Head Science Lecturer & Visual Educator",
  qualifications: "B.Sc. (Hons) Special in Science, National Education Certified",
  experience: "12+ Years O/L & A/L Teaching",
  studentsTaught: "45,000+",
  passRate: "98.4% A/B Rate",
  photo: "/Thisula.jpeg",
  bio: "Specialist in transforming complex Biology, Chemistry, and Physics concepts into interactive visual models and high-scoring exam techniques for O/L and A/L Sri Lankan students.",
  achievements: [
    "Pioneer of Motion Science Education in Sri Lanka",
    "Author of G.C.E. O/L Science Model Paper Series",
    "Produced 150+ Island Rankers in O/L & A/L Science Streams"
  ]
};

export const COURSES = [
  {
    id: "course-bio-1",
    title: "O/L Biology: Human Organ Systems & Cell Biology",
    slug: "ol-biology-human-organ-systems",
    subject: "Biology",
    grade: "Grade 11 O/L",
    level: "All Levels",
    rating: 4.9,
    reviewsCount: 1420,
    studentsCount: 18450,
    duration: "18 Hours",
    lessonsCount: 24,
    price: 3500,
    isFree: false,
    badge: "POPULAR",
    thumbnail: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80",
    description: "Master the human digestive, circulatory, nervous, and respiratory systems with interactive anatomical models and past paper questions.",
    learningObjectives: [
      "Analyze human organ systems using spatial models",
      "Master cellular respiration and enzyme kinetics equations",
      "Solve past paper structural questions with scoring keywords"
    ],
    sections: [
      {
        id: "sec-1",
        title: "Section 1: Microscopic Cell Structure & Functions",
        lessons: [
          {
            id: "les-1",
            title: "1.1 Plant vs Animal Cell Organelles",
            duration: "25 min",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            summary: "Detailed analysis of mitochondria, ribosomes, nucleus, and cell membrane transport."
          },
          {
            id: "les-2",
            title: "1.2 Cell Division: Mitosis vs Meiosis",
            duration: "30 min",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            summary: "Chromosome replication phase animations and genetic variation principles."
          }
        ],
        quiz: {
          id: "quiz-sec-1",
          title: "Section 1 Cell Biology Assessment",
          timeLimit: 10,
          passingScore: 70,
          questions: [
            {
              id: "q1",
              question: "Which organelle is known as the powerhouse of the cell?",
              options: ["Mitochondria", "Ribosome", "Golgi Apparatus", "Endoplasmic Reticulum"],
              correctIndex: 0,
              explanation: "Mitochondria produce cellular ATP energy through aerobic respiration."
            },
            {
              id: "q2",
              question: "What is the result of mitotic cell division?",
              options: ["4 Haploid cells", "2 Diploid identical daughter cells", "2 Haploid cells", "4 Diploid cells"],
              correctIndex: 1,
              explanation: "Mitosis produces two genetically identical diploid daughter cells for growth and repair."
            }
          ]
        }
      },
      {
        id: "sec-2",
        title: "Section 2: Human Circulatory & Blood System",
        lessons: [
          {
            id: "les-3",
            title: "2.1 Cardiac Anatomy & Blood Flow",
            duration: "35 min",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            summary: "Virtual heart dissection showing chambers, valves, and systemic circulation."
          }
        ]
      }
    ]
  },
  {
    id: "course-chem-1",
    title: "Chemistry: Atomic Structure & Chemical Bonding",
    slug: "chemistry-atomic-structure-chemical-bonding",
    subject: "Chemistry",
    grade: "Grade 10 / 11 O/L",
    level: "Intermediate",
    rating: 4.95,
    reviewsCount: 980,
    studentsCount: 14200,
    duration: "15 Hours",
    lessonsCount: 18,
    price: 3200,
    isFree: false,
    badge: "MUST LEARN",
    thumbnail: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    description: "Visualize electronic configurations, ionic/covalent bonding, mole concept calculations, and redox reactions.",
    sections: [
      {
        id: "sec-chem-1",
        title: "Section 1: Atomic Theory & Subatomic Particles",
        lessons: [
          {
            id: "les-chem-1",
            title: "1.1 Quantum Model & Bohr Atom",
            duration: "28 min",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            summary: "Animation of s and p electron orbitals and shell filling order."
          }
        ],
        quiz: {
          id: "quiz-chem-1",
          title: "Atomic Structure Quiz",
          timeLimit: 10,
          passingScore: 70,
          questions: [
            {
              id: "qc1",
              question: "What subatomic particle determines the atomic number of an element?",
              options: ["Neutron", "Proton", "Electron", "Positron"],
              correctIndex: 1,
              explanation: "The atomic number equals the number of protons in the nucleus."
            }
          ]
        }
      }
    ]
  },
  {
    id: "course-phy-1",
    title: "Physics: Light Optics, Refraction & Wave Motion",
    slug: "physics-light-optics-refraction",
    subject: "Physics",
    grade: "Grade 11 O/L",
    level: "Advanced",
    rating: 4.88,
    reviewsCount: 860,
    studentsCount: 11300,
    duration: "16 Hours",
    lessonsCount: 20,
    price: 3500,
    isFree: false,
    badge: "HIGH SCORING",
    thumbnail: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
    description: "Ray diagrams, Snell's law of refraction, total internal reflection, optical instruments, and wave mechanics explained with interactive simulation.",
    sections: [
      {
        id: "sec-phy-1",
        title: "Section 1: Refraction through Lenses & Prisms",
        lessons: [
          {
            id: "les-phy-1",
            title: "1.1 Convex & Concave Lens Ray Tracing",
            duration: "32 min",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            summary: "Step-by-step ray tracing construction for focal points and image formation."
          }
        ]
      }
    ]
  },
  {
    id: "course-pastpaper-1",
    title: "G.C.E. O/L 10-Year Past Paper Discussion Masterclass",
    slug: "ol-past-paper-masterclass",
    subject: "Past Paper Discussion",
    grade: "Grade 11 O/L",
    level: "Exam Revision",
    rating: 5.0,
    reviewsCount: 2150,
    studentsCount: 29500,
    duration: "25 Hours",
    lessonsCount: 30,
    price: 0,
    isFree: true,
    badge: "FREE ACCESS",
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    description: "Complete line-by-line past paper analysis with marking scheme secrets, keyword highlighting, and time management strategies by Lecturer Thisula.",
    sections: [
      {
        id: "sec-pp-1",
        title: "Section 1: 2025 O/L Science Paper Discussion",
        lessons: [
          {
            id: "les-pp-1",
            title: "2025 MCQ Paper Complete Walkthrough",
            duration: "45 min",
            type: "video",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            summary: "All 40 MCQ questions analyzed with shortcut elimination tricks."
          }
        ]
      }
    ]
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Kavisha Perera",
    school: "Visakha Vidyalaya, Colombo",
    grade: "O/L Science - A Grade",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    text: "Lecturer Thisula's motion lessons made Biology organ systems so easy to visualize. I went from B grade in term test to an easy A in O/L Exam!"
  },
  {
    id: 2,
    name: "Sahan Jayawardena",
    school: "Royal College, Colombo",
    grade: "Island Rank 4 - O/L",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    text: "The chemistry mole concept used to be confusing until I took the Atomic bonding module on ScienceWithThisula. Best LMS platform in Sri Lanka!"
  },
  {
    id: 3,
    name: "Dilini Rajapaksha",
    school: "Dharmasoka College, Ambalangoda",
    grade: "O/L Science - A Grade",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    text: "The past paper discussion masterclass provided exact keywords that appeared in the final government marking scheme. Highly recommended!"
  }
];
