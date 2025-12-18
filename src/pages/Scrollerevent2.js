
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import img from "../images/mess.jpg";
import React, { useState } from "react";


import "./Scrollevent.css";
export default function Scrollevent2(){
  const [events, diffevents] = useState(false);
      const settings = {
        dots: true,
        infinite: true,
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
                    <img  alt="" />
                </div>
                <div className="event-title"></div>
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