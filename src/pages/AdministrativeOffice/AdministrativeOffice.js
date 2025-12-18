import React from 'react';
import './AdministrativeOffice.css';
import BootstrapCard from '../../components/Cards/BootstrapCard'; // Import your BootstrapCard component
import RamjeeRepaka from '../../images/faculty/ramjee-repaka.jpeg';
import RPrabhu from '../../images/faculty/r-prabhu.jpg';
import ArunVerma from "../../images/staff/arun-verma.jpg";
import AmolDiwate from '../../images/staff/amol-diwate.jpg';
import Avinash from "../../images/staff/avinash-b.jpg";
import JanardhanReddy from '../../images/staff/janardhan-reddy-s.jpg';
import { motion } from 'framer-motion';

export default function AdministrativeOffice() {
    return (
        <motion.div className='pb-5 pt-2' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            <div className="d-flex flex-column">
                <hr className="w-50 border-3 align-self-center"/>
            </div>

            <h1 className='mb-2'>Student Welfare Administrative Office</h1>

            <div className="d-flex flex-column">
                <hr className="w-50 border-3 align-self-center"/>
            </div>

            <div className='mt-5'>
                <div className='custom-sub-header fs-2'>
                    <p> About </p>
                </div>
                <div className='custom-content text-left'>
                    <p className='fs-5'>
                        The Student Welfare Administrative office Team at IIT Dharwad believes in all-round development of holistic personality of its students and ensures students' stay on campus is comfortable, fruitful, and happy. The SW Team is on duty 24 hours round the clock with Hostel Managers residing with the students in the Hostels.
                    </p>
                    <p className='fs-5'>
                        IIT Dharwad practices gender equality, respects neurodivergence, and is a socially all-inclusive residential campus. The Campus buildings, including Hostels, are designed for accessibility by persons with disabilities (PWD).
                    </p>
                </div>
            </div>

            <div className='row rounded p-2 justify-content-center custom-important-container'>
                <div className="col-md-3">
                </div>
                <div className="col-md-3">
                    <BootstrapCard
                        image={RPrabhu}
                        name="Prof. R Prabhu"
                        title="Dean, Student Welfare"
                        moreInfoHTML="<a href='https://iitdh.ac.in/user-profile/r-prabhu'>Prof. R Prabhu's Homepage</a>"
                        email="mailto:dean.sw@iitdh.ac.in"
                    />
                </div>
                <div className="col-md-3">
                    <BootstrapCard
                        image={ArunVerma}
                        name="Shri. Arun Verma"
                        title="Assistant Registrar, Student Welfare"
                        moreInfoHTML="<a href='https://iitdh.ac.in/node/2468'>Shri. Arun Verma's Homepage</a>"
                        email="mailto:arsw@iitdh.ac.in"
                    />
                </div>
                <div className="col-md-3">
                </div>
                <div className="col-md-3">
                    <BootstrapCard
                        image={AmolDiwate}
                        name="Shri. Amol Diwate"
                        title="Junior Superintendent"
                        moreInfoHTML="<a href='https://iitdh.ac.in/user-profile/amol-diwate'>Shri. Amol Diwate's Homepage</a>"
                        email="mailto:amoldiwate@iitdh.ac.in"
                    />
                </div>
                <div className="col-md-3">
                    <BootstrapCard
                        image={Avinash}
                        name="Shri. Avinash B"
                        title="Junior Assistant"
                        moreInfoHTML="<a href='https://iitdh.ac.in/user-profile/avinash-b'>Shri. Avinash B's Homepage</a>"
                        email="mailto:avinashb@iitdh.ac.in"
                    />
                </div>
                <div className="col-md-3">
                    <BootstrapCard
                        image={JanardhanReddy}
                        name="Shri. Janardhan Reddy S"
                        title="Junior Assistant"
                        moreInfoHTML="<a href='https://iitdh.ac.in/user-profile/janardhan-reddy'>Shri. Janardhan Reddy S's Homepage</a>"
                        email="mailto:sjanardhanreddy@iitdh.ac.in"
                    />
                </div>
            </div>
        </motion.div>
    );
}
