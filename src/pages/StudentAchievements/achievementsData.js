import imgTechMeet1 from "../../images/InterIITTechMeet14_Gold.jpg";
import imgTechMeet2 from "../../images/InterIITTechMeet14_Contigent.jpg";
import imgAmazonML318 from "../../images/Amazon_ML_2025_318.jpeg"
import imgAmazonML376 from "../../images/Amazon_ML_2025_376.jpeg"
const achievementsData = [
    {
  id: 1,
  event: "ICPC",
  title: "International Collegiate Programming Contest",
  placement: "Ranks 115, 362 & 550",
  year: 2025,
  description:
  "Three teams from the institute qualified in the International Collegiate Programming Contest (ICPC) 2025 Prelims, showcasing strong problem-solving skills and algorithmic expertise.\n\n" +
  " Team OopsWeACedit — Rank 115\n" +
  " • Dileepan S K (CS23BT049)\n • Vishvanathan K (EP23BT002)\n • Krish Gupta (CS24BT038)\n\n" +
  " Team Busy Beavers — Rank 362\n" +
  "  • Naveen T S (CS24BT006)\n • Prakhar Gupta (CS24BT003)\n • Harsha P (CS24BT021)\n\n" +
  " Team MemoryMisers — Rank 550\n" +
  "  • Samarth M (MC24BT010)\n • Bhuvan Saraf (CS24BT028)\n • Shashank Satishkumar (EP24BT006)",
  icon: "FaMedal",
  color: "silver",
},
{
  id: 2,
  event: "Inter IIT Tech Meet 14.0",
  title: "Inter IIT Tech Meet 14.0",
  placement: "Winners",
  year: 2025,
  description:
"The institute achieved a landmark milestone at the Inter IIT Tech Meet 14.0, held at IIT Patna from 11–15 December 2025, by securing a Gold Medal in the Quantitative Finance domain — a first in the institute’s Inter IIT Tech Meet history.\n\n" +
"🏆 Gold Medal — Quantitative Finance (High Prep)\n" +
"Problem Statement: Ebullient Securities\n" +
"Team Lead: Nidhish Doshi\n" +
"Team Members: Dileepan S K, Anant Tripathi, Swarup Sahoo, Trisham Bepari, Samarth M, Sudhakar Shivanand Dalawayi, Swastik Malani\n\n" +
"In addition to the Gold Medal finish, the institute recorded strong performances across multiple competitive domains:\n\n" +
"• 5th Place — Drona Aviations (Aerial Robotics, Low Prep)\n" +
"  Team Lead: Balamurali V B\n" +
"  Team Members: Aditya Jain, Shrikant Chandrashekhar Sonawane, Kaustubh Mishra\n\n" +
"• 9th Place — ISRO VLSI (VLSI Design, Mid Prep)\n" +
"  Team Lead: Prabhanshu Kumar Jha\n" +
"  Team Members: Dipanshu Biswas, Mallikarjun S Biradar, Kaushal Aditya Bhooshan, Haridarshan R, Maanas Khatokar N\n\n" +
"• 10th Place — Observe.ai (NLP & Conversational Intelligence, Mid Prep)\n" +
"  Team Lead: Soumya Basuli\n" +
"  Team Members: Pakalapati Naga Srinivasa Varma, Anushaa B, Anubhav Goyal, Naitik Goyal",
  icon: "FaTrophy",
  color: "gold",
  images: [
    {
      src: imgTechMeet1,
      alt: "Inter IIT Tech Meet 1",
      size: "medium",
    },
    {
      src: imgTechMeet2,
      alt: "Inter IIT Tech Meet 2",
      size: "medium",
    },
  ],
},
{
  id: 3,
  event: "LAM Research Challenge",
  title: "LAM Research Challenge 2.0",
  placement: "Finalists (Top 24 Nationally)",
  year: 2025,
  description:
    "Two teams from the institute emerged as finalists in the LAM Research Challenge 2.0, securing positions among the top 24 teams nationwide out of approximately 700 participating teams.\n\n" +
    " Team Gunners — Finalists\n" +
    " • Ishaan Janjuha (CS23BT043)\n • Ishabh Janjuha (ME23BT006)\n • Shreyas Reddy (EC24BT033)\n • Rajat Gupta (ME24BT049)\n\n" +
    " Team Sassy Samosas — Finalists\n" +
    " • Farhaan Nasir (ME23BT023)\n • Saipushkar Nagaraj (CS23BT072)\n • Yash Halbhavi (CS23BT069)\n • Vidit Parikh (MC23BT010)",
  icon: "FaMedal",
  color: "silver",
},
{
  id: 4,
  event: "Amazon ML Challenge",
  title: "Amazon ML Challenge 2025",
  placement: "Top 400 Nationally",
  year: 2025,
  description:
    "Two teams from the institute secured positions within the top 400 in the Amazon ML Challenge 2025, standing out among more than 80,000 registered teams.\n\n" +
    " Team 1 — Rank 318\n" +
    " • Darji Tapash Hiren (CS23BT036)\n • Pullipudi Sri Smaran (CS23BT039)\n • Meda Varshith (CS23BT066)\n\n" +
    " Team 2 — Rank 376\n" +
    " • Priyanshu Vijay (IS23BM007)\n • Ajitesh Manan Jha (ME23BT013)\n • Dev Kaushal (EP23BT004)\n • Surya Prakash S (CS23BT068)",
  icon: "FaTrophy",
  color: "silver",
  images: [
    {
      src: imgAmazonML318,
      alt: "Amazon ML Challenge 2025 318",
      size: "medium",
    },
    {
      src: imgAmazonML376,
      alt: "Amazon ML Challenge 2025 376",
      size: "medium",
    },
  ],
},
{
  id: 5,
  event: "CSAW Embedded Security Challenge",
  title: "CSAW Embedded Security Challenge 2025",
  placement: "Finalists",
  year: 2025,
  description:
    "A team from the institute, led by Samarth M, qualified for the finals of the CSAW Embedded Security Challenge 2025. The competition is internationally recognized for its rigorous focus on embedded systems security, hardware exploitation, and low-level system analysis, highlighting the team’s strong technical depth and problem-solving capabilities.",
  icon: "FaShieldAlt",
  color: "teal",
}
  // {
  //   id: 4,
  //   event: "Hackathon 2024",
  //   title: "National Software Development Hackathon",
  //   placement: "1st Place",
  //   year: 2024,
  //   description:
  //     "Won the prestigious national hackathon with an innovative IoT solution. Our team demonstrated exceptional coding skills and creative problem-solving abilities in developing a real-time monitoring system.",
  //   icon: "FaTrophy",
  //   color: "gold",
  //   images: [
  //     {
  //       src: "https://via.placeholder.com/300x400?text=Hackathon+Win",
  //       alt: "Hackathon Winners",
  //       size: "large",
  //     },
  //     {
  //       src: "https://via.placeholder.com/250x250?text=Code+Demo",
  //       alt: "Code Demo",
  //       size: "small",
  //     },
  //   ],
  // },
  // {
  //   id: 5,
  //   event: "Quiz Championship",
  //   title: "All India Technical Quiz",
  //   placement: "2nd Place",
  //   year: 2024,
  //   description:
  //     "Strong performance in the all-India technical quiz competition. Students demonstrated deep knowledge across multiple engineering disciplines.",
  //   icon: "FaMedal",
  //   color: "silver",
  //   images: [],
  // },
  // {
  //   id: 6,
  //   event: "Design Challenge",
  //   title: "Product Design & Innovation",
  //   placement: "Winners",
  //   year: 2023,
  //   description:
  //     "Our design team created an innovative solution for sustainable campus infrastructure. The project was appreciated for its environmental impact and practical implementation approach.",
  //   icon: "FaTrophy",
  //   color: "gold",
  //   images: [
  //     {
  //       src: "https://via.placeholder.com/350x300?text=Design+Project",
  //       alt: "Design Project",
  //       size: "medium",
  //     },
  //     {
  //       src: "https://via.placeholder.com/300x400?text=Design+Mockup",
  //       alt: "Design Mockup",
  //       size: "medium",
  //     },
  //     {
  //       src: "https://via.placeholder.com/400x300?text=Final+Design",
  //       alt: "Final Design",
  //       size: "medium",
  //     },
  //   ],
  // },
  // {
  //   id: 7,
  //   event: "Sports Championship",
  //   title: "University Inter-College Sports Meet",
  //   placement: "Gold Medals",
  //   year: 2024,
  //   description:
  //     "IIT Dharwad athletes showcased exceptional performance in multiple sports disciplines, bringing glory to the institute.",
  //   icon: "FaMedal",
  //   color: "bronze",
  //   images: [
  //     {
  //       src: "https://via.placeholder.com/400x300?text=Sports+Event",
  //       alt: "Sports Event",
  //       size: "large",
  //     },
  //   ],
  // },
  // {
  //   id: 8,
  //   event: "Research Publication",
  //   title: "IEEE Conference Paper Accepted",
  //   placement: "Accepted",
  //   year: 2024,
  //   description:
  //     "Student research on machine learning applications was accepted and presented at an international IEEE conference.",
  //   icon: "FaTrophy",
  //   color: "gold",
  //   images: [
  //     {
  //       src: "https://via.placeholder.com/300x400?text=Research+Paper",
  //       alt: "Research Paper",
  //       size: "medium",
  //     },
  //     {
  //       src: "https://via.placeholder.com/350x300?text=Conference",
  //       alt: "Conference",
  //       size: "medium",
  //     },
  //   ],
  // },
  // {
  //   id: 9,
  //   event: "Cultural Fest",
  //   title: "Inter IIT Cultural Competition",
  //   placement: "Top 3",
  //   year: 2024,
  //   description:
  //     "IIT Dharwad's cultural team showcased talent in music, dance, and drama across multiple categories.",
  //   icon: "FaMedal",
  //   color: "silver",
  //   images: [
  //     {
  //       src: "https://via.placeholder.com/300x350?text=Cultural+Performance",
  //       alt: "Cultural Performance",
  //       size: "medium",
  //     },
  //     {
  //       src: "https://via.placeholder.com/350x300?text=Team+Performance",
  //       alt: "Team Performance",
  //       size: "medium",
  //     },
  //   ],
  // },
  // {
  //   id: 10,
  //   event: "Entrepreneurship Award",
  //   title: "Best Student Startup Initiative",
  //   placement: "Winners",
  //   year: 2024,
  //   description:
  //     "Students won recognition for their innovative startup idea in the sustainability and green energy sector.",
  //   icon: "FaTrophy",
  //   color: "gold",
  //   images: [],
  // },
];

export default achievementsData;
