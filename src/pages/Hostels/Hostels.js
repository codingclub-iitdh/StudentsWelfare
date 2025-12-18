import React from 'react';

import ImageGrid from '../../components/ImageGrid/ImageGrid.js';
import BootstrapCard from '../../components/Cards/BootstrapCard.js';
import PeopleList from '../../components/PeopleList/PeopleList.js';
import {images, wardens} from './HostelsData.js'

import SarojMondal from '../../images/faculty/saroj-mondal.jpg';
import SudhirKumarSahoo from '../../images/faculty/sudhir-kumar-sahoo.jpg';
import SubhashMehto from '../../images/faculty/subhash-mehto.png';
import RakeshLingam from '../../images/faculty/rakesh-lingam.jpg';
import SushantaKumarSethi from '../../images/faculty/sushanta-kumar-sethi.jpg';
import RumaGhosh from '../../images/faculty/ruma-ghosh.jpg';
import ShraddhaSrivastava from '../../images/faculty/shraddha-srivastava.jpeg';


import { motion } from 'framer-motion';

export default function Hostels() {
    return (
        <>
            <motion.div className='pb-5 pt-2' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                <div className="d-flex flex-column">
                    <hr className="w-50 border-3 align-self-center"/>
                </div>

                <h1 className='mb-2'>Hostels</h1>

                <div className="d-flex flex-column">
                    <hr className="w-50 border-3 align-self-center"/>
                </div>

                <div className='mt-5'>
                    <div className='custom-sub-header fs-2'>
                        <p>Hostels</p>
                    </div>
                    <div className='custom-content text-start fs-5'>
                        <p>
                            IIT Dharwad being a fully residential institute, all students are mandatorily accommodated in hostels within the campus.
                            Girls have a separate section. Hostels are safe and under round the clock security supervision.
                            There are two hostel blocks (Hostel Block - I and - II) with a total of 550 spacious rooms each accommodating, up to four students, belonging to the same batch.
                        </p>

                         <div>
                            <ImageGrid
                                key={1}
                                images={images.slice(0, 3)} // First set of images
                                width="332px" // Adjustable width
                                height="250px" // Adjustable height
                            />
                        </div>

                        <p>
                            The hostels and mess blocks have access to a very good campus internet network (wired and wireless).
                            Adequate common bathrooms, washrooms, cloth washing machines-drying area and indoor play areas are available in each floor along with three spacious common rooms.
                            These common rooms have television, a study setup and to encourage various social/recreational/group activities such as meetings.
                            Water filter facility is available in the hostels in each wing round the clock.
                            Availability of dedicated bicycle stands, courtyards for outdoor activities, nurse station and medical isolation rooms, security, housekeeping and other hostel staff on 24 hours duty are salient features of these hostels.
                        </p>

                        <div>
                            <ImageGrid
                                key={2}
                                images={images.slice(3, 6)} // First set of images
                                width="332px" // Adjustable width
                                height="250px" // Adjustable height
                            />
                        </div>

                        <p>
                            While basic furniture are provided, students have to arrange for their personal furnishings like beds and bedsheets.
                            IIT Dharwad hostels provide an ideal, social and peaceful environment for studies and all-round personality.
                        </p>
                    </div>
                </div>

                {/*<div className='d-flex flex-column align-items-center'>
                    <div className='rounded custom-important-container pt-5 col-md-4 row'>
                        <div className='col-md-12 d-flex flex-column align-items-center text-center mb-5'>
                            <h2 className='text-decoration-underline'>HOSTEL WARDENS</h2>
                        </div>

                        <div className='d-flex flex-column align-items-center text-center'>
                            <PeopleList
                                mainTitle=""
                                items={wardens}
                                customClasses={{
                                    unorderedList: 'text-start'
                                }}
                            />
                        </div>

                    </div>
                </div>*/}

                <div className='mt-5 custom-sub-header fs-2 rounded'>
                    <p>Hostel Wardens</p>
                </div>

                <p className='custom-content text-start fs-5'>
                    The Hostel Wardens at IIT Dharwad are responsible for ensuring the safety, well-being, and overall management of the hostel environment.
                    They play a crucial role in cultivating a supportive community for students, addressing their needs, and promoting a positive living experience within the hostels.

                </p>



                <div className='d-flex flex-column align-items-center'>
                    <div className="rounded custom-important-container p-5">
                        <h3>
                            Warden - Boys Hostel 1 PC
                        </h3>
                        <div className="row p-2 justify-content-center">
                            <div className="col-lg-6 col-md-6">
                                <BootstrapCard
                                    image={SudhirKumarSahoo}
                                    name="Prof. Sudhir Kumar Sahoo"
                                    title="Warden - Boys Hostel 1 PC"
                                    moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/sudhir-kumar-sahoo'>Prof. Sudhir Kumar Sahoo's Homepage</a>"
                                    email="mailto:warden-boys-hostel-1-pc@iitdh.ac.in"
                                />
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <BootstrapCard
                                    image={SubhashMehto}
                                    name="Prof. Subhash Mehto"
                                    title="Warden - Boys Hostel 1 PC"
                                    moreInfoHTML="<a href='https://iitdh.ac.in/user-profile/subhash-mehto'>Prof. Subhash Mehto's Homepage</a>"
                                    email="mailto:warden-boys-hostel-1-pc@iitdh.ac.in"
                                />
                            </div>
                        </div>

                        <hr/>
                        <h3>
                            Warden - Boys Hostel 2 PC
                        </h3>

                        <div className="row p-2 justify-content-center">
                            <div className="col-lg-4 col-md-6">
                                <BootstrapCard
                                    image={SarojMondal}
                                    name="Prof. Saroj Mondal"
                                    title="Warden - Boys Hostel 2 PC"
                                    moreInfoHTML="<a href='https://iitdh.ac.in/user-profile/saroj-mondal'>Prof. Saroj Mondal's Homepage</a>"
                                    email="mailto:warden-boys-hostel-2-pc@iitdh.ac.in"
                                />
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <BootstrapCard
                                    image={RakeshLingam}
                                    name="Rakesh Lingam"
                                    title="Warden - Boys Hostel 2 PC"
                                    moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/rakesh-lingam'>Rakesh Lingam's Homepage</a>"
                                    email="mailto:warden-boys-hostel-2-pc@iitdh.ac.in"
                                />
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <BootstrapCard
                                    image={SushantaKumarSethi}
                                    name="Prof. Sushanta Kumar Sethi"
                                    title="Warden - Boys Hostel 2 PC"
                                    moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/sushanta-kumar-sethi'>Prof. Sushanta Kumar Sethi's Homepage</a>"
                                    email="mailto:warden-boys-hostel-2-pc@iitdh.ac.in"
                                />
                            </div>
                        </div>

                        <hr/>
                        <h3>
                            Warden - Girls Hostel 1 PC
                        </h3>

                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-6">
                                <BootstrapCard
                                    image={RumaGhosh}
                                    name="Prof. Ruma Ghosh"
                                    title="Warden - Girls Hostel PC"
                                    moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/ruma-ghosh'>Prof. Ruma Ghosh's Homepage</a>"
                                    email="mailto:warden-girls-hostel-1-pc@iitdh.ac.in"
                                />
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <BootstrapCard
                                    image={ShraddhaSrivastava}
                                    name="Prof. Shraddha Srivastava"
                                    title="Warden - Girls Hostel PC"
                                    moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/shraddha-srivastava'>Prof. Shraddha Srivastava's Homepage</a>"
                                    email="mailto:warden-girls-hostel-1-pc@iitdh.ac.in"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    )
}
