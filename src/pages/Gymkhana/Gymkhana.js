import React, { useEffect, useRef, useState } from 'react';
import './Gymkhana.css';

import ImageGrid from '../../components/ImageGrid/ImageGrid.js';
import BootstrapCard from '../../components/Cards/BootstrapCard.js';
import { facultyInCharges, secretaries, clubSecretaries, imagesSports, imagesCultural, imagesTech, imagesSocial } from './GymkhanaData.js';

import KavitaDevi from '../../images/faculty/kavita-devi.jpg';
import VigneshwaraRajaP from '../../images/faculty/vigneshwara-raja-p.jpg';

import { motion, useAnimation, useInView } from 'framer-motion';

export default function Gymkhana() {
    const techCouncil = useRef();
    const culturalCouncil = useRef();
    const sportsCouncil = useRef();
    const socialActivities = useRef();

    const [activeTab, setActiveTab] = useState("tech"); // "tech", "sports", "cultural"

    const scrollHandler = (elmRef) => {
        window.scrollTo({ top: elmRef.current.offsetTop - 90, behavior: "smooth" });
    };

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    const genSecList = secretaries.find(s => s.subTitle.startsWith('General Secretaries'))?.subSubTitles[0]?.people || [];
    const jrGenSecList = secretaries.find(s => s.subTitle.startsWith('Junior General Secretaries'))?.subSubTitles[0]?.people || [];

    const getClubSecretariesByTab = () => {
        if (activeTab === "tech") {
            const match = clubSecretaries.find(s => s.subTitle.startsWith("Tech"));
            return match ? match.subSubTitles[0].people : [];
        } else if (activeTab === "sports") {
            const match = clubSecretaries.find(s => s.subTitle.startsWith("Sports"));
            return match ? match.subSubTitles[0].people : [];
        } else {
            const match = clubSecretaries.find(s => s.subTitle.startsWith("Cultural"));
            return match ? match.subSubTitles[0].people : [];
        }
    };

    const clubList = getClubSecretariesByTab();

    // Group club secretaries by their club so that Secretary & Deputy Secretary are never split across columns
    const groupClubs = (list) => {
        const groups = [];
        let currentGroup = [];
        let currentClubName = null;

        list.forEach(person => {
            const parts = person.designation.split(',');
            const clubName = parts.length > 1 ? parts[1].trim().toLowerCase() : person.designation.toLowerCase();

            if (currentClubName === null) {
                currentClubName = clubName;
                currentGroup.push(person);
            } else if (clubName.includes(currentClubName) || currentClubName.includes(clubName)) {
                currentGroup.push(person);
            } else {
                groups.push(currentGroup);
                currentGroup = [person];
                currentClubName = clubName;
            }
        });
        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }
        return groups;
    };

    const clubGroups = groupClubs(clubList);
    
    // Separate groups of multiple members (pairs) and single-person groups
    const pairs = clubGroups.filter(group => group.length > 1);
    const singles = clubGroups.filter(group => group.length === 1);

    // Distribute pairs between Left and Right columns
    let leftGroups = [];
    let rightGroups = [];
    let leftCount = 0;
    const totalPairPeople = pairs.reduce((sum, g) => sum + g.length, 0);

    pairs.forEach(group => {
        const person = group[0];
        const designation = person.designation.toLowerCase();

        if (activeTab === "cultural") {
            const isLeftClub = designation.includes("dramatics") || 
                               designation.includes("fine arts") || 
                               designation.includes("music") || 
                               designation.includes("photography");
            if (isLeftClub) {
                leftGroups.push(group);
                leftCount += group.length;
            } else {
                rightGroups.push(group);
            }
        } else if (activeTab === "sports") {
            const isLeftClub = designation.includes("athletics") || 
                               designation.includes("basketball") || 
                               designation.includes("chess") || 
                               designation.includes("cricket") || 
                               designation.includes("football") || 
                               designation.includes("table tennis") ||
                               designation.includes("volleyball");
            if (isLeftClub) {
                leftGroups.push(group);
                leftCount += group.length;
            } else {
                rightGroups.push(group);
            }
        } else {
            // Default balancing logic for tech tab
            if (leftCount < totalPairPeople / 2) {
                leftGroups.push(group);
                leftCount += group.length;
            } else {
                rightGroups.push(group);
            }
        }
    });

    // Push all single-person groups at the end of the second (right) column
    rightGroups = rightGroups.concat(singles);

    // Split General Secretaries and Junior General Secretaries into rows of 3 and 2
    const firstRowGenSec = genSecList.slice(0, 3);
    const secondRowGenSec = genSecList.slice(3);

    const firstRowJrGenSec = jrGenSecList.slice(0, 3);
    const secondRowJrGenSec = jrGenSecList.slice(3);

    return (
        <>
            <motion.div className='pb-5 pt-2' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Title Section matching other pages */}
                <div className="d-flex flex-column">
                    <hr className="w-50 border-3 align-self-center"/>
                </div>

                <h1 className='mb-2 text-center'>Gymkhana</h1>

                <div className="d-flex flex-column">
                    <hr className="w-50 border-3 align-self-center"/>
                </div>

                {/* About Section */}
                <div className='mt-5'>
                    <div className='custom-sub-header fs-2'>
                        <p>About</p>
                    </div>
                    <div className='custom-content text-left mt-3'>
                        <p className='fs-5 text-muted'>
                            The Gymkhana at IIT Dharwad serves as a vibrant hub for student life, promoting physical fitness, sportsmanship, and cultural engagement.
                            It is dedicated to fostering a sense of community among students through various athletic and recreational activities. The Gymkhana provides state-of-the-art facilities for outdoor and indoor sports, along with fitness programs that cater to diverse interests.
                            In addition to sports, it hosts cultural events and activities, encouraging students to explore their creative talents and collaborate with peers.
                            By nurturing both physical and artistic pursuits, the Gymkhana plays a crucial role in enhancing the overall student experience at IIT Dharwad.
                        </p>
                    </div>
                </div>

                {/* Council Quick Links Cards Grid */}
                <div className='mt-5'>
                    <div className="row g-4 justify-content-center">
                        <div className="col-lg-3 col-md-6" onClick={() => scrollHandler(sportsCouncil)}>
                            <div className='gymkhana-council-card'>
                                <h3>Sports Council</h3>
                                <ul>
                                    <li>Outdoor Games</li>
                                    <li>Indoor Games</li>
                                    <li>Fitness Center</li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6" onClick={() => scrollHandler(techCouncil)}>
                            <div className='gymkhana-council-card'>
                                <h3>Technical Council</h3>
                                <ul>
                                    <li>Workshops</li>
                                    <li>Technical Fests</li>
                                    <li>Competitions</li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6" onClick={() => scrollHandler(culturalCouncil)}>
                            <div className='gymkhana-council-card'>
                                <h3>Cultural Council</h3>
                                <ul>
                                    <li>Festivities</li>
                                    <li>Cultural Fests</li>
                                    <li>Competitions</li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6" onClick={() => scrollHandler(socialActivities)}>
                            <div className='gymkhana-council-card'>
                                <h3>Social Activities</h3>
                                <ul>
                                    <li>NSO</li>
                                    <li>NSS</li>
                                    <li>NCC</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Faculty Members Section */}
                <div className='mt-5'>
                    <div className='custom-sub-header fs-2 mb-4'>
                        <p>Faculty Members</p>
                    </div>
                    <div className='rounded custom-important-container px-5 py-4 w-100'>
                        <h5 className="mb-3 text-uppercase fw-bold">Faculty In Charges - Gymkhana</h5>
                        <div style={{ width: "50px", height: "3.4px", backgroundColor: "#86198f", marginTop: "7px", marginBottom: "18px" }}></div>

                        <div className="row pt-2 justify-content-center g-4">
                            <div className="col-lg-4 col-md-6 d-flex justify-content-center">
                                <BootstrapCard
                                    image={KavitaDevi}
                                    name="Prof. Kavita Devi"
                                    title="Faculty-In-Charge, Students Welfare, NSS"
                                    moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/kavita-devi'>Prof. Kavita Devi's Homepage</a>"
                                    email="mailto:fic.sw.nss@iitdh.ac.in"
                                />
                            </div>
                            <div className="col-lg-4 col-md-6 d-flex justify-content-center">
                                <BootstrapCard
                                    image={VigneshwaraRajaP}
                                    name="Prof. Vigneshwara Raja P"
                                    title="Faculty-In-Charge, Students Welfare, NCC"
                                    moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/vigneshwara-raja-p'>Prof. Vigneshwara Raja P's Homepage</a>"
                                    email="mailto:fic.sw.ncc@iitdh.ac.in"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student Council Section */}
                <div className='mt-5'>
                    <div className='custom-sub-header fs-2 mb-4'>
                        <p>Student Council Members</p>
                    </div>

                    {/* General Secretaries and Junior General Secretaries Directory Grid with left-right padding */}
                    <div className='rounded custom-important-container px-5 py-4 mb-4'>
                        <h5 className="council-main-header">Student Council Secretaries</h5>
                        
                        {/* General Secretaries (3 on first line, 2 on second line, left-aligned) */}
                        <div className="mb-5">
                            <h6 className="council-sub-header">General Secretaries</h6>
                            <div className="row g-4 mb-3">
                                {firstRowGenSec.map((person, pIndex) => (
                                    <div className="col-md-4 col-sm-6" key={pIndex}>
                                        <div className="minimal-text-block">
                                            <div className="minimal-block-name">{person.name}</div>
                                            <div className="minimal-block-role">{person.designation}</div>
                                            {person.email && (
                                                <a href={`mailto:${person.email}`} className="minimal-block-email">
                                                    {person.email}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="row g-4">
                                {secondRowGenSec.map((person, pIndex) => (
                                    <div className="col-md-4 col-sm-6" key={pIndex}>
                                        <div className="minimal-text-block">
                                            <div className="minimal-block-name">{person.name}</div>
                                            <div className="minimal-block-role">{person.designation}</div>
                                            {person.email && (
                                                <a href={`mailto:${person.email}`} className="minimal-block-email">
                                                    {person.email}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Junior General Secretaries (3 on first line, 2 on second line, left-aligned) */}
                        <div>
                            <h6 className="council-sub-header">Junior General Secretaries</h6>
                            <div className="row g-4 mb-3">
                                {firstRowJrGenSec.map((person, pIndex) => (
                                    <div className="col-md-4 col-sm-6" key={pIndex}>
                                        <div className="minimal-text-block">
                                            <div className="minimal-block-name">{person.name}</div>
                                            <div className="minimal-block-role">{person.designation}</div>
                                            {person.email && (
                                                <a href={`mailto:${person.email}`} className="minimal-block-email">
                                                    {person.email}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="row g-4">
                                {secondRowJrGenSec.map((person, pIndex) => (
                                    <div className="col-md-4 col-sm-6" key={pIndex}>
                                        <div className="minimal-text-block">
                                            <div className="minimal-block-name">{person.name}</div>
                                            <div className="minimal-block-role">{person.designation}</div>
                                            {person.email && (
                                                <a href={`mailto:${person.email}`} className="minimal-block-email">
                                                    {person.email}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Club Secretaries Tab Layout Directory Grid with left-right padding */}
                    <div className='rounded custom-important-container px-5 py-4 w-100'>
                        <h5 className="council-main-header">Club Secretaries</h5>
                        
                        {/* Custom Tab Switcher */}
                        <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
                            <button 
                                className={`btn-tab ${activeTab === 'tech' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('tech')}
                            >
                                Technical Council
                            </button>
                            <button 
                                className={`btn-tab ${activeTab === 'sports' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('sports')}
                            >
                                Sports Council
                            </button>
                            <button 
                                className={`btn-tab ${activeTab === 'cultural' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('cultural')}
                            >
                                Cultural Council
                            </button>
                        </div>

                        {/* Splitting grid into Left 2 columns and Right 2 columns with a divider in between */}
                        <div className="row g-4 mt-2">
                            {/* Left 2 Columns */}
                            <div className="col-md-6 club-directory-divider">
                                {leftGroups.map((group, gIndex) => (
                                    <div className="row g-4 mb-3" key={gIndex}>
                                        {group.map((person, pIndex) => (
                                            <div className="col-sm-6" key={pIndex}>
                                                <div className="minimal-text-block">
                                                    <div className="minimal-block-name">{person.name}</div>
                                                    <div className="minimal-block-role">{person.designation}</div>
                                                    {person.email && (
                                                        <a href={`mailto:${person.email}`} className="minimal-block-email">
                                                            {person.email}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            
                            {/* Right 2 Columns */}
                            <div className="col-md-6">
                                {rightGroups.map((group, gIndex) => (
                                    <div className="row g-4 mb-3" key={gIndex}>
                                        {group.map((person, pIndex) => (
                                            <div className="col-sm-6" key={pIndex}>
                                                <div className="minimal-text-block">
                                                    <div className="minimal-block-name">{person.name}</div>
                                                    <div className="minimal-block-role">{person.designation}</div>
                                                    {person.email && (
                                                        <a href={`mailto:${person.email}`} className="minimal-block-email">
                                                            {person.email}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sports Council Details */}
                <div className='mt-5' ref={sportsCouncil}>
                    <div className='custom-sub-header fs-2'>
                        <p>Sports Council</p>
                    </div>

                    <div className="custom-content text-left mt-3">
                        <p className='fs-5 text-muted'>
                            The Sports Council is dedicated to fostering a vibrant and inclusive sports culture within the student community.
                            Its primary mission is to promote physical fitness, teamwork, and sportsmanship among students through a variety of athletic activities.
                            The council organizes events and competitions catering to diverse interests, ensuring that every student has the opportunity to participate and excel in their chosen sport.
                            By providing resources, coaching, and support, the Sports Council aims to cultivate a spirit of healthy competition and camaraderie, empowering students to achieve their personal best while building lasting friendships and memories.
                        </p>
                    </div>

                    <div className='row mt-4 g-4'>
                        <div className='col-lg-4 col-md-6 council-column'>
                            <h4 className="council-column-title">Outdoor Games</h4>
                            <ul className="council-column-list">
                                <li>Football</li>
                                <li>Volleyball</li>
                                <li>Cricket</li>
                                <li>Basketball</li>
                                <li>Swimming</li>
                            </ul>
                        </div>
                        <div className='col-lg-4 col-md-6 council-column'>
                            <h4 className="council-column-title">Indoor Games</h4>
                            <ul className="council-column-list">
                                <li>Chess</li>
                                <li>Carrom-Board</li>
                                <li>Badminton</li>
                                <li>Squash</li>
                                <li>Table tennis</li>
                            </ul>
                        </div>
                        <div className='col-lg-4 col-md-12 council-column'>
                            <h4 className="council-column-title">Gym Activities</h4>
                            <ul className="council-column-list">
                                <li>Powerlifting</li>
                                <li>Weightlifting</li>
                                <li>Yoga</li>
                            </ul>
                        </div>
                    </div>

                    <div className='image-block'>
                        <ImageGrid
                            images={imagesSports}
                            width="100%"
                            height="250px"
                            columns={4}
                        />
                    </div>
                </div>

                {/* Cultural Council Details */}
                <div className='mt-5' ref={culturalCouncil}>
                    <div className='custom-sub-header fs-2'>
                        <p>Cultural Council</p>
                    </div>

                    <div className="custom-content text-left mt-3">
                        <p className='fs-5 text-muted'>
                            The Cultural Council is dedicated to promoting artistic expression and cultural awareness within the student community.
                            It serves as a platform for students to explore their creative talents and engage in various cultural activities.
                            Through workshops, events, and performances, the council aims to foster a sense of community and appreciation for the arts,
                            encouraging students to collaborate and showcase their skills.
                        </p>
                    </div>

                    <div className='row mt-4 g-4'>
                        {/* Grouped Clubs & Activities under a single header spanning two columns */}
                        <div className='col-lg-8 col-md-12 council-column'>
                            <h4 className="council-column-title">Clubs and Activities</h4>
                            <div className="row">
                                <div className="col-md-6">
                                    <ul className="council-column-list">
                                        <li>Sapphire - Dance Club</li>
                                        <li>Dramatics Club</li>
                                        <li>Aesthetica - Fine Arts Club</li>
                                        <li>Eunoia - Literary Club</li>
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <ul className="council-column-list">
                                        <li>Music Club</li>
                                        <li>Focus - Photography Club</li>
                                        <li>Quiz Club</li>
                                        <li>Prabodhini - Spiritual Club</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div className='col-lg-4 col-md-12 council-column'>
                            <h4 className="council-column-title">Other Events</h4>
                            <ul className="council-column-list">
                                <li>Inter IIT Cultural Meet</li>
                                <li>Harshtaal - Annual Cultural Fest</li>
                            </ul>
                        </div>
                    </div>

                    <div className='image-block'>
                        <ImageGrid
                            images={imagesCultural}
                            width="100%"
                            height="250px"
                            columns={4}
                        />
                    </div>
                </div>

                {/* Technical Council Details */}
                <div className='mt-5' ref={techCouncil}>
                    <div className='custom-sub-header fs-2'>
                        <p>Technical Council</p>
                    </div>

                    <div className="custom-content text-left mt-3">
                        <p className='fs-5 text-muted'>
                            The Technical Council serves as a student-led platform dedicated to nurturing and promoting students' technical interests.
                            Its primary objectives include facilitating and supporting various technical clubs in executing their projects, events, and other activities.
                            By providing guidance, resources, and assistance, the council enables students to explore, learn, and develop their skills in diverse technical domains.
                            Ultimately, it aims to create an environment that encourages innovation, collaboration, and the pursuit of excellence in technical fields among the student body.
                        </p>
                    </div>

                    <div className='row mt-4 g-4'>
                        {/* Grouped Clubs & Activities under a single header spanning two columns */}
                        <div className='col-lg-8 col-md-12 council-column'>
                            <h4 className="council-column-title">Clubs and Activities</h4>
                            <div className="row">
                                <div className="col-md-6">
                                    <ul className="council-column-list">
                                        <li>Hardly Human - AI Club</li>
                                        <li>Code Geass - Coding Club</li>
                                        <li>Cosmosoc - Space Data Science</li>
                                        <li>Robotics Club</li>
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <ul className="council-column-list">
                                        <li>Insolvent - Finance Club</li>
                                        <li>Ingene - Motorsports Club</li>
                                        <li>Abhikalpa - Design Club</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div className='col-lg-4 col-md-12 council-column'>
                            <h4 className="council-column-title">Other Events</h4>
                            <ul className="council-column-list">
                                <li>PARSEC - Annual Technical Fest</li>
                                <li>Summer of Innovation</li>
                                <li>Inter IIT Tech Meet</li>
                            </ul>
                        </div>
                    </div>

                    <div className='image-block'>
                        <ImageGrid
                            images={imagesTech}
                            width="100%"
                            height="250px"
                            columns={4}
                        />
                    </div>
                </div>

                {/* Social Activities Details */}
                <div className='mt-5' ref={socialActivities}>
                    <div className='custom-sub-header fs-2'>
                        <p>Social Activities</p>
                    </div>

                    <div className="custom-content text-left mt-3">
                        <p className='fs-5 text-muted mb-4'>
                            Social Activities play a vital role in fostering community engagement and social responsibility among students.
                        </p>
                        
                        <div className="row g-4">
                            <div className="col-md-4">
                                <div className="social-activity-block">
                                    <h4>National Service Scheme (NSS)</h4>
                                    <p>Conducted by the Ministry of Youth Affairs and Sports, it encourages participation in community service, helping students develop empathy and civic duty.</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="social-activity-block">
                                    <h4>National Sports Organization (NSO)</h4>
                                    <p>Also under the Ministry of Youth Affairs and Sports, it promotes physical fitness and teamwork through sports, instilling discipline and a competitive spirit.</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="social-activity-block">
                                    <h4>National Cadet Corps (NCC)</h4>
                                    <p>Under the Ministry of Defence, it provides military training and leadership development, empowering students to become responsible citizens.</p>
                                </div>
                            </div>
                        </div>
                        
                        <p className='fs-5 text-muted mt-4'>
                            Together, these initiatives create an environment where students can thrive and make a meaningful impact.
                        </p>
                    </div>

                    <div className='image-block mt-4'>
                        <ImageGrid
                            images={imagesSocial}
                            width="100%"
                            height="250px"
                            columns={4}
                        />
                    </div>
                </div>

            </motion.div>
        </>
    );
}
