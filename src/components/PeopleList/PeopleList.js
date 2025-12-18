import React, { useState } from 'react';

const PeopleList = ({ mainTitle, items, customStyles = {}, customClasses = {} }) => {
    const [visibleEmailIndex, setVisibleEmailIndex] = useState(null);

    const toggleEmail = (index) => {
        setVisibleEmailIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <div className={`${customClasses.container}`}>
            <h3 style={customStyles.mainTitle} className={customClasses.mainTitle}>
                {mainTitle}
            </h3>

            {items.map((item, index) => (
                <div key={index} className={`mb-5 ${customClasses.item}`}>
                    <h4 style={customStyles.subTitle} className={customClasses.subTitle}>
                        {item.subTitle}
                    </h4>

                    {item.subSubTitles.map((subSubItem, subIndex) => (
                        <div key={subIndex}>
                            <h5 style={customStyles.subSubTitle} className={customClasses.subSubTitle}>
                                {subSubItem.title}
                            </h5>

                            <ul
                                style={customStyles.unorderedList}
                                className={`${customClasses.unorderedList}`}
                            >
                                {subSubItem.people.map((person, personIndex) => {
                                    const uniqueIndex = `${index}-${subIndex}-${personIndex}`;
                                    const isVisible = visibleEmailIndex === uniqueIndex;

                                    return (
                                        <li
                                            key={uniqueIndex}
                                            style={customStyles.listItem}
                                            className={`${customClasses.listItem} mb-3`}
                                            onMouseOver={() => toggleEmail(uniqueIndex)}
                                            onMouseOut={() => toggleEmail(uniqueIndex)}
                                        >
                                            <h6
                                                className="fs-5 cursor-pointer"
                                                style={{
                                                    color: "#4338ca",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {person.name}
                                            </h6>

                                            {person.designation && (
                                                <p className="text-muted mb-1">{person.designation}</p>
                                            )}

                                            <div
                                                style={{
                                                    maxHeight: isVisible ? "40px" : "0px",
                                                    opacity: isVisible ? 1 : 0,
                                                    overflow: "hidden",
                                                    transition: "opacity 0.3s ease, max-height 0.3s ease",
                                                }}
                                            >
                                                {person.email && (
                                                    <p className="mb-0">
                                                        <a
                                                            href={`mailto:${person.email}`}
                                                            style={{
                                                                color: "#2563eb",
                                                                textDecoration: "none",
                                                                fontFamily: "monospace",
                                                            }}
                                                            onMouseOver={(e) =>
                                                                (e.target.style.textDecoration = "underline")
                                                            }
                                                            onMouseOut={(e) =>
                                                                (e.target.style.textDecoration = "none")
                                                            }
                                                        >
                                                            {person.email}
                                                        </a>
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default PeopleList;
