
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import img from "../images/1.png";
import React, { useState } from "react";


import "./Scrollevent.css";
export default function Scrollevent(){
  const [events, diffevents] = useState(true);
      const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
          { 
            breakpoint: 1024,
            settings: { slidesToShow: 2, slidesToScroll: 1 },
          },
          {
            breakpoint: 600,
            settings: { slidesToShow: 1, slidesToScroll: 1 },
          },
        ],
      };
    return(
      <div>
        {events?(

        <div className="event-scroller" style={{ borderBottom: "5px solid #86198f", boxShadow: "rgba(0, 0, 0, 0.16) 0px 10px 36px 0px " }}>
        <div className="head">Upcoming Events</div>
        <Slider {...settings}>
            
            <div  className="event-card">
                <div className="event-all">

                <div className="event-image">
                    <img src={img} alt="" />
                </div>
                <div >

                <div className="event-title">MENTAL HEALTH SENSITIZATION WORKSHOP</div>
                <div className="speaker">Experts: Prof. Pradeep Yammiyavar and Ms. Vijaylakshmi Peri</div>
                <div className="venue">7 January 2025, 1:50PM, CLT F300</div>
                <div className="pdf-wrap">
                <a href="https://drive.google.com/file/d/1fxsdC2getkEWLMzCeSO9C2Cz2tIPXdG3/view?usp=sharing" className="pdf">View More</a>
                </div>
                </div>
                </div>
            
            </div>

        </Slider>
      </div>
        ):(
          <div></div>
        )}
      </div>
    )
}