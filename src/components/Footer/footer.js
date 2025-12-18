import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const handleClick = () => {
        window.location.href = '/student-activities';
    }

    return (
        <footer className="text-white py-4" style={{ backgroundColor: 'purple' }}>
            <div className="container">
                <div className="row g-5">
                    <div className="col-md-4">
                        <ul className="list-unstyled">
                            <li>INDIAN INSTITUTE OF TECHNOLOGY DHARWAD</li>
                            <li>PERMANENT CAMPUS</li>
                            <li>CHIKKAMALLIGAWAD</li>
                            <li>DHARWAD - 580 011</li>
                            <li>KARNATAKA</li>
                            <li>BHARATA (INDIA)</li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h3>About Us</h3>
                        <p className="mb-0">Committed to the holistic development and welfare of students at IIT Dharwad.</p>
                    </div>
                    <div className="col-md-4">
                        <h3>Our Links</h3>
                        <ul className="list-unstyled">
                            <li>
                                <a href='https://intranet.iitdh.ac.in:444/' className="text-white">Intranet</a>
                            </li>
                            <li>
                                <Link to="#" className="text-white" onClick={handleClick}>Student Activities</Link>
                            </li>
                            <li>
                                <Link to="#" className="text-white">RTI</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-12 text-center">
                        <p className="mb-0">&copy; {new Date().getFullYear()} Coding Club IITDH. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
