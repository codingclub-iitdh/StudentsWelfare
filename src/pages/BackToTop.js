import React from "react"
import { useEffect } from "react";
import { useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import "./BackToTop.css";

function BackToTop() {

    const [backToTopButton, setBackToTopButton] = useState(false);
    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 1000) {
                setBackToTopButton(true);
            } else {
                setBackToTopButton(false)
            }
        })
    })

    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }
    
    return (
       <div>
        {
            backToTopButton &&(
                <button onClick={scrollUp} className="btn-grad">
                        <FaArrowUp/>
                    </button>
            )
        }
       </div>
    )
}

export default BackToTop;