import React, { useEffect } from 'react';
import './Gymkhana.css';

import PeopleList from '../../components/PeopleList/PeopleList.js';
import ImageGrid from '../../components/ImageGrid/ImageGrid.js';
import BootstrapCard from '../../components/Cards/BootstrapCard.js';
import {facultyInCharges, secretaries, clubSecretaries, imagesSports, imagesCultural, imagesTech, imagesSocial} from './GymkhanaData.js'

import RaviGalimath from '../../images/staff/ravi-galimath.jpg';
import KeerthiKumarM from '../../images/staff/keerthi-kumar-m.jpeg';
import RameshG from '../../images/staff/ramesh-g.png';

import KavitaDevi from '../../images/faculty/kavita-devi.jpg';
import VigneshwaraRajaP from '../../images/faculty/vigneshwara-raja-p.jpg';
import NagaveniS from '../../images/faculty/nagaveni-s.jpg';

import { useRef } from 'react';
import { FaArrowDownLong } from 'react-icons/fa6';
import BackToTop from '../BackToTop';
import { motion, useAnimation, useInView } from 'framer-motion';


export default function Gymkhana() {

    const techCouncil = useRef();
    const culturalCouncil = useRef();
    const sportsCouncil = useRef();
    const socialActivities = useRef();

    const scrollHandler = (elmRef) => {
        console.log(elmRef.current)
        window.scrollTo({ top: elmRef.current.offsetTop, behavior: "smooth" });
    }


    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible")
        }
    }, [isInView])
    return (
        <>
            <motion.div className='pb-5 pt-2' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                <div className="d-flex flex-column">
                    <hr className="w-50 border-3 align-self-center"/>
                </div>

                <h1 className='mb-2'>Gymkhana</h1>

                <div className="d-flex flex-column">
                    <hr className="w-50 border-3 align-self-center"/>
                </div>

                <div className='fs-2 mt-5 m-3'>
                    <p className='custom-sub-header'>About</p>
                </div>

                <div className='d-flex flex-column align-items-center m-3'>
                    <p className='fs-5' style={{ color: '#666666' }}>
                        The Gymkhana at IIT Dharwad serves as a vibrant hub for student life, promoting physical fitness, sportsmanship, and cultural engagement.
                        It is dedicated to fostering a sense of community among students through various athletic and recreational activities. The Gymkhana provides state-of-the-art facilities for outdoor and indoor sports, along with fitness programs that cater to diverse interests.
                        In addition to sports, it hosts cultural events and activities, encouraging students to explore their creative talents and collaborate with peers.
                        By nurturing both physical and artistic pursuits, the Gymkhana plays a crucial role in enhancing the overall student experience at IIT Dharwad.
                    </p>
                </div>

                <div>
                    <div className="row g-4">
                        <motion.div className="col-lg-3" onClick={() => scrollHandler(sportsCouncil)}>
                            <div className='gymkhana-council-box'>
                                <p>SPORTS COUNCIL</p>
                                <ul>
                                    <li><a>Outdoor Games</a></li>
                                    <li><a>Indoor Games</a></li>
                                    <li><a>Fitness Center</a></li>
                                </ul>
                            </div>
                        </motion.div>

                        <motion.div className="col-lg-3" onClick={() => scrollHandler(techCouncil)}>
                            <div className='gymkhana-council-box'>
                            <p>TECHNICAL COUNCIL</p>
                                <ul>
                                    <li><a>Workshops</a></li>
                                    <li><a>Technical Fests</a></li>
                                    <li><a>Competitions</a></li>
                                </ul>
                            </div>
                        </motion.div>

                        <motion.div className="col-lg-3" onClick={() => scrollHandler(culturalCouncil)}>
                            <div className='gymkhana-council-box'>
                            <p>CULTURAL COUNCIL</p>
                                <ul>
                                    <li><a>Festivities</a></li>
                                    <li><a>Cultural Fests</a></li>
                                    <li><a>Competitions</a></li>
                                </ul>
                            </div>
                        </motion.div>

                        <motion.div className="col-lg-3" onClick={() => scrollHandler(socialActivities)}>
                            <div className='gymkhana-council-box'>
                            <p>SOCIAL ACTIVITIES</p>
                            <ul>
                                <li><a>NSO</a></li>
                                <li><a>NSS</a></li>
                                <li><a>NCC</a></li>
                            </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>


                <div className='fs-2 mt-5'>
                    <p className='custom-sub-header'>Faculty Members</p>
                </div>

                <div>
                    <div className='d-flex flex-column align-items-center'>
                        <div className='rounded custom-important-container p-4'>
                            <h5>FACULTY IN CHARGES - GYMKHANA</h5>
                            <div style={{ width: "50px", height: "3.4px", backgroundColor: "#86198f", marginTop: "7px", marginBottom: "18px" }}></div>

                            {/*<div className='d-flex flex-column align-items-center'>
                                <PeopleList
                                    mainTitle=""
                                    items={facultyInCharges}
                                />
                            </div>*/}

                            <div className="row pt-2 justify-content-center">
                                <div className="col-lg-4 col-md-12">
                                    <BootstrapCard
                                        image={KavitaDevi}
                                        name="Prof. Kavita Devi"
                                        title="Faculty-In-Charge, Students Welfare, NSS"
                                        moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/kavita-devi'>Prof. Kavita Devi's Homepage</a>"
                                        email="mailto:fic.sw.nss@iitdh.ac.in"
                                    />
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <BootstrapCard
                                        image={VigneshwaraRajaP}
                                        name="Prof. Vigneshwara Raja P"
                                        title="Faculty-In-Charge, Students Welfare, NCC"
                                        moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/vigneshwara-raja-p'>Prof. Vigneshwara Raja P's Homepage</a>"
                                        email="mailto:fic.sw.ncc@iitdh.ac.in"
                                    />
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <BootstrapCard
                                        image={NagaveniS}
                                        name="Prof. Nagaveni S"
                                        title="Faculty-In-Charge, Students Welfare, Cultural & Technical Affairs"
                                        moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/nagaveni-s'>Prof. Nagaveni S's Homepage</a>"
                                        email="mailto:fic.sw.tech@iitdh.ac.in,fic.sw.cultural@iitdh.ac.in"
                                    />
                                </div>
                            </div>

                        </div>

                        <hr />

                        <div className='rounded custom-important-container p-3'>
                            <h5>SPORTS OFFICERS</h5>
                            <div style={{ width: "50px", height: "3.4px", backgroundColor: "#86198f", marginTop: "7px", marginBottom: "18px" }}></div>

                            <div className="row pt-2 justify-content-center">
                                <div className="col-lg-4 col-md-12">
                                    <BootstrapCard
                                        image={KeerthiKumarM}
                                        name="Dr. Keerthi Kumar M"
                                        title="Sports Officer"
                                        moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/dr-keerthi-kumar-m'>Dr. Keerthi Kumar M's Homepage</a>"
                                    />
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <BootstrapCard
                                        image={RaviGalimath}
                                        name="Shri Ravi Shivaprakash Galimath"
                                        title="Assistant Sports Officer"
                                        moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/ravi-shivaprakash-galimath'>Shri Ravi Shivaprakash Galimath's Homepage</a>"
                                    />
                                </div>
                                <div className="col-lg-4 col-md-6">
                                    <BootstrapCard
                                        image={RameshG}
                                        name="Shri Gundaveni Ramesh"
                                        title="Assistant Sports Officer"
                                        moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/gundaveni-ramesh'>Shri Gundaveni Ramesh's Homepage</a>"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='fs-2 mt-5'>
                    <p className='custom-sub-header'>Student Council Members</p>
                </div>

                <div>
                    {/*<div className='rounded custom-important-container p-3 d-flex flex-column align-items-center'>*/}
                        <div className='rounded custom-important-container p-4'>
                            <h5>STUDENT COUNCIL SECRETARIES</h5>
                            <div style={{ width: "50px", height: "3.4px", backgroundColor: "#86198f", marginTop: "7px", marginBottom: "18px" }}></div>

                            <div className='row'>
                                <div className='d-flex flex-column align-items-center col-md-4'>
                                    <PeopleList
                                        mainTitle=""
                                        items={secretaries.filter(secretary => secretary.subTitle.startsWith('General Secretaries'))}
                                    />
                                </div>
                                <div className='d-flex flex-column align-items-center col-md-4'>
                                    <PeopleList
                                        mainTitle=""
                                        items={secretaries.filter(secretary => secretary.subTitle.startsWith('PG Secretaries'))}
                                    />
                                </div>
                                <div className='d-flex flex-column align-items-center col-md-4'>
                                    <PeopleList
                                        mainTitle=""
                                        items={secretaries.filter(secretary => secretary.subTitle.startsWith('Junior General Secretaries'))}
                                        customClasses={{
                                            listItem: 'w-100'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='rounded custom-important-container p-4 w-100'>
                            <h5>CLUB SECRETARIES</h5>
                            <div style={{ width: "50px", height: "3.4px", backgroundColor: "#86198f", marginTop: "7px", marginBottom: "18px" }}></div>

                            <div className='row'>
                                <div className='d-flex flex-column align-items-center col-md-4'>
                                    <PeopleList
                                        mainTitle=""
                                        items={clubSecretaries.filter(secretary => secretary.subTitle.startsWith('Tech Club Secretaries'))}
                                    />
                                </div>
                                <div className='d-flex flex-column align-items-center col-md-4'>
                                    <PeopleList
                                        mainTitle=""
                                        items={clubSecretaries.filter(secretary => secretary.subTitle.startsWith('Sports Club Secretaries'))}
                                    />
                                </div>
                                <div className='d-flex flex-column align-items-center col-md-4'>
                                    <PeopleList
                                        mainTitle=""
                                        items={clubSecretaries.filter(secretary => secretary.subTitle.startsWith('Cultural Club Secretaries'))}
                                    />
                                </div>
                            </div>
                        </div>

                        <BackToTop />

                    {/*</div>*/}
                </div>

                <div className='mt-5'>

                    <div className='fs-2'>
                        <p className='custom-sub-header' ref={sportsCouncil}>Sports Council</p>
                    </div>

                    <p className='fs-5' style={{color: '#666666'}}>
                        The Sports Council is dedicated to fostering a vibrant and inclusive sports culture within the student community.
                        Its primary mission is to promote physical fitness, teamwork, and sportsmanship among students through a variety of athletic activities.
                        The council organizes events and competitions cater to diverse interests, ensuring that every student has the opportunity to participate and excel in their chosen sport.
                        By providing resources, coaching, and support, the Sports Council aims to cultivate a spirit of healthy competition and camaraderie, empowering students to achieve their personal best while building lasting friendships and memories.
                    </p>

                    <div className='row'>
                        <div className='col-lg-4 col-md-6'>
                            <div>
                                <p className='custom-sub-header border-danger fs-3'>Outdoor Games</p>
                            </div>
                            <div className='fs-5'>
                                <ul>
                                    <li>Football</li>
                                    <li>Volleyball</li>
                                    <li>Cricket</li>
                                    <li>Basketball</li>
                                    <li>Swimming</li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-lg-4 col-md-6'>
                            <div>
                                <p className='custom-sub-header border-danger fs-3'>Indoor Games</p>
                            </div>
                            <div className='fs-5'>
                                <ul>
                                    <li>Chess</li>
                                    <li>Carrom-Board</li>
                                    <li>Badminton</li>
                                    <li>Squash</li>
                                    <li>Table tennis</li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-lg-4 col-md-4'>
                            <div>
                                <p className='custom-sub-header border-danger fs-3'>Gym Activities</p>
                            </div>
                            <div className='fs-5'>
                                <ul>
                                    <li>Powerlifting</li>
                                    <li>Weightlifting</li>
                                    <li>Yoga</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className='image-block'>
                        <ImageGrid
                            key={1}
                            images={imagesSports} // Combine all images into a single array
                            width="332px" // Adjustable width
                            height="250px" // Adjustable height
                            columns={4} // Adjustable number of columns
                        />
                    </div>

                    <div className='custom-sub-header fs-2' ref={culturalCouncil}>
                        <p>Cultural Council</p>
                    </div>

                    <p className='fs-5' style={{ color: '#666666' }}>
                        The Cultural Council is dedicated to promoting artistic expression and cultural awareness within the student community.
                        It serves as a platform for students to explore their creative talents and engage in various cultural activities.
                        Through workshops, events, and performances, the council aims to foster a sense of community and appreciation for the arts,
                        encouraging students to collaborate and showcase their skills.
                    </p>

                    <div className='row'>
                        <div className='col-lg-4 col-md-6'>
                            <div>
                                <p className='custom-sub-header border-danger fs-3'>Clubs and Activities</p>
                            </div>
                            <div className='fs-5'>
                                <ul>
                                    <li>Sapphire - Dance Club</li>
                                    <li>Dramatics Club</li>
                                    <li>Aesthetica - Fine Arts Club</li>
                                    <li>Eunoia - Literary Club</li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-lg-4 col-md-6'>
                            <div>
                                <p className='custom-sub-header border-danger fs-3'>Clubs and Activities</p>
                            </div>
                            <div className='fs-5'>
                                <ul>
                                    <li>Music Club</li>
                                    <li>Focus - Photography Club</li>
                                    <li>Quiz Club</li>
                                    <li>Prabodhini - Spiritual Club</li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-lg-4 col-md-4'>
                            <div>
                                <p className='custom-sub-header border-danger fs-3'>Other Events</p>
                            </div>
                            <div className='fs-5'>
                                <ul>
                                    <li>Inter IIT Cultural Meet</li>
                                    <li>Harshtaal - Annual Cultural Fest</li>
                                </ul>
                            </div>
                        </div>
                    </div>


                    <div className='image-block'>
                        <ImageGrid
                            key={1}
                            images={imagesCultural} // Combine all images into a single array
                            width="332px" // Adjustable width
                            height="250px" // Adjustable height
                            columns={4} // Adjustable number of columns
                        />
                    </div>

                    <div className='custom-sub-header fs-2' ref={techCouncil}>
                        <p>Technical Council</p>
                    </div>

                    <p className='fs-5' style={{ color: '#666666' }}>
                        The Technical Council serves as a student-led platform dedicated to nurturing and promoting students' technical interests.
                        Its primary objectives include facilitating and supporting various technical clubs in executing their projects, events, and other activities.
                        By providing guidance, resources, and assistance, the council enables students to explore, learn, and develop their skills in diverse technical domains.
                        Ultimately, it aims to create an environment that encourages innovation,collaboration, and the pursuit of excellence in technical fields among the student body.
                    </p>

                    <div className='row'>
                        <div className='col-lg-4 col-md-6'>
                            <div>
                                <p className='custom-sub-header border-danger fs-3'>Clubs and Activities</p>
                            </div>
                            <div className='fs-5'>
                                <ul>
                                    <li>Hardly Human - AI Club</li>
                                    <li>Code Geass - Coding Club</li>
                                    <li>Cosmosoc - Space Data Science</li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-lg-4 col-md-6'>
                            <div>
                                <p className='custom-sub-header border-danger fs-3'>Clubs and Activities</p>
                            </div>
                            <div className='fs-5'>
                                <ul>
                                    <li>Robotics Club</li>
                                    <li>Insolvent - Finance Club</li>
                                    <li>Ingene - Motorsports Club</li>
                                    <li>Abhikalpa - Design Club</li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-lg-4 col-md-4'>
                            <div>
                                <p className='custom-sub-header border-danger fs-3'>Other Events</p>
                            </div>
                            <div className='fs-5'>
                                <ul>
                                    <li>PARSEC - Annual Technical Fest</li>
                                    <li>Summer of Innovation</li>
                                    <li>Inter IIT Tech Meet</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className='image-block'>
                        <ImageGrid
                            key={1}
                            images={imagesTech} // Combine all images into a single array
                            width="332px" // Adjustable width
                            height="250px" // Adjustable height
                            columns={4} // Adjustable number of columns
                        />
                    </div>

                    <div className='custom-sub-header fs-2' ref={socialActivities}>
                        <p>Social Activities</p>
                    </div>

                   <p className='fs-5' style={{ color: '#666666' }}>
                        Social Activities play a vital role in fostering community engagement and social responsibility among students.
                        <br/>
                        <ul>
                            <li> The National Service Scheme (NSS), conducted by the Ministry of Youth Affairs and Sports, encourages participation in community service, helping students develop empathy and civic duty. </li>
                            <br/>
                            <li> The National Sports Organization (NSO), also under the Ministry of Youth Affairs and Sports, promotes physical fitness and teamwork through sports, instilling discipline and a competitive spirit. </li>
                            <br/>
                            <li> The National Cadet Corps (NCC), under the Ministry of Defence, provides military training and leadership development, empowering students to become responsible citizens. </li>
                            <br/>
                        </ul>
                            Together, these initiatives create an environment where students can thrive and make a meaningful impact.
                    </p>

                    <div className='image-block'>
                        <ImageGrid
                            key={1}
                            images={imagesSocial} // Combine all images into a single array
                            width="332px" // Adjustable width
                            height="250px" // Adjustable height
                            columns={4} // Adjustable number of columns
                        />
                    </div>
                </div>



            </motion.div>
        </>
    )
}
