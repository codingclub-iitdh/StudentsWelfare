import React, { useEffect } from 'react';
import './Health.css';
import { LiaHospital } from 'react-icons/lia';
import { IoIosArrowDown } from 'react-icons/io';
import { SiGotomeeting } from 'react-icons/si';
import { useRef } from 'react';

import RajshekarK from '../../../images/faculty/rajshekar-k.jpg';
import OmkarBembalge from '../../../images/faculty/omkar-basavaraj-bembalge.jpg';
import RidhimaTewari from '../../../images/faculty/ridhima-tewari.jpg';

import BootstrapCard from '../../../components/Cards/BootstrapCard.js';

import wellnesscentre from '../../../images/wellnesscentre.jpg';
import { motion } from 'framer-motion';
import Scrollevent from '../../Scrollerevent2';



// this section is for Health




export default function WellnessSection() {



    const wellness = useRef();
    const counselling = useRef();
    const scrollHandler = (elmRef) => {
        console.log(elmRef.current)
        window.scrollTo({ top: elmRef.current.offsetTop, behavior: "smooth" });
    }


    return (
        <>
            <motion.div className='pb-5 pt-2' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="d-flex flex-column">
                    <hr className="w-50 border-3 align-self-center"/>
                </div>

                <h1 className='mb-2'>Wellness & Health</h1>

                <div className="d-flex flex-column">
                    <hr className="w-50 border-3 align-self-center"/>
                </div>

                <div className='mt-5'>
                    <div className='custom-sub-header fs-2'>
                        <p>Wellness Centre</p>
                    </div>

                    <div className='custom-content text-start fs-4'>
                        <p>
                            The Wellness Centre hosts Medical and Mental Wellness services for all the campus residents. A panel of eminent visiting Doctors provide consultations at the Centre which is 24x7 facility with Nurses and Ambulance service.
                            The Psychological Counselling services are operated online by service providers.
                            A Volunteering Counselling Psychologist is available on campus by appointment.
                        </p>
                    </div>

                    <div className='mt-5 card custom-important-container text-center pt-5'>
                        <img className='card-img-top w-75 h-auto' src={wellnesscentre} alt="Wellness Centre" />
			<div className='card-body'>
                            <b><p className='fs-3'>Contacts</p></b>
                            <p className='fs-5 text-muted'><i>For Ambulance Services:</i> +918971523447</p>
                            <p className='fs-5 text-muted'><i>Wellness Center Mobile:</i> +918147403386</p>
                            <p className='fs-5 text-muted'><i>Wellness Center Landline:</i> 08362309644</p>
                            <a href="https://maps.app.goo.gl/vLfZWxkLpektRyc16" className='btn btn-primary'>View in Map</a>
                        </div>
                    </div>
                </div>

                <div className='mt-5 custom-sub-header fs-2'>
                    <p>Visiting Doctors</p>
                </div>

                <div className='mcustom-content text-start fs-4'>
                    <p>
                        <li>Dr. S S Mudakavi, General Physician</li>
                        <li>Dr. K.V Achyutha, Pediatrician</li>
                        <li>Dr. Reshma Rathod, Consultant Obstetrician & Gynecologist</li>
                        <li>Dr. Aditya Pandurangi, Consultant Psychiatrist</li>
                        <li>Dr. Sudhir Bhatbolan, Physiotherapist</li>
                        <li>Dr. Shrikrishna.N. Javali, General Physician</li>
                    </p>
                </div>

                <div className='mt-5 custom-sub-header fs-2'>
                    <p>Associate Dean & Faculty in Charge</p>
                </div>

                <div className='d-flex flex-column align-items-center'>
                    <div className="rounded custom-important-container p-3">
                        <div className="row p-2 justify-content-center">
                            <div className="col-lg-4 col-md-12">
                                <BootstrapCard
                                    image={RidhimaTewari}
                                    name="Prof. Ridhima Tewari"
                                    title="Associate Dean, Students Welfare, Wellness"
                                    moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/ridhima-tewari'>Prof. Ridhima Tewari's Homepage</a>"
                                    email="mailto:adean.sww@iitdh.ac.in"
                                />
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <BootstrapCard
                                    image={RajshekarK}
                                    name="Prof. Rajshekar K"
                                    title="Faculty-In-Charge, Counselling"
                                    moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/rajshekar-k'>Prof. Rajshekar K's Homepage</a>"
                                    email="mailto:fic.counselling@iitdh.ac.in"
                                />
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <BootstrapCard
                                    image={OmkarBembalge}
                                    name="Prof. Omkar Basavaraj Bembalge"
                                    title="Faculty-In-Charge, Students Welfare (Health and Ambulance)"
                                    moreInfoHTML="<a href='https://www.iitdh.ac.in/user-profile/omkar-baswaraj-bembalge'>Prof. Omkar Basavaraj Bembalge's Homepage</a>"
                                    email="mailto:fic.health@iitdh.ac.in"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    )
}
