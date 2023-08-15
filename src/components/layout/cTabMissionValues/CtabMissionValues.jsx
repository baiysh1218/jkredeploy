import React, { useContext, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import SwiperCore, { Navigation } from "swiper/core";
import Loader from "../../loader/Loader";
import { pageContext } from "../../../contexts/PageContext/PageContext";
import "./style/CtabMissionValues.css";
import DropDownCard from "../../teamCardDropDown/DropDownCard";
import { useNavigate } from "react-router-dom";

SwiperCore.use([Navigation]);

const CtabMissionValues = ({ marker }) => {
  const tabsRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [closingDropdownId, setClosingDropdownId] = useState(null);
  const [uniqueTeams, setUniqueTeams] = useState([]);
  const [allEmploees, setAllEmploees] = useState(null);
  const [emplSliced, setEmpSliced] = useState(allEmploees);
  const [location, setLocation] = useState("");

  const { line, language } = useContext(pageContext);

  const navigate = useNavigate();

  const toggleDropdown = employeeId => {
    if (openDropdownId === employeeId) {
      setIsClosing(true);
      setClosingDropdownId(employeeId);
      setTimeout(() => {
        setOpenDropdownId(null);
        setIsClosing(false);
        setClosingDropdownId(null);
      }, 500); // Delay in milliseconds before hiding the dropdown
    } else {
      setOpenDropdownId(employeeId);
    }
  };

  const filteredDepartment = () => {
    const uniqueDepartments = {};
    const uniqueTeamsArr = [];
    for (const obj of line) {
      for (const team of obj.team) {
        const department = team.department;
        if (!uniqueDepartments[department]) {
          uniqueDepartments[department] = true;
          uniqueTeamsArr.push(team);
        }
      }
    }
    setUniqueTeams(uniqueTeamsArr);
  };

  const allEmpl = () => {
    const allEmplArr = [];
    for (const obj of line) {
      allEmplArr.push(...obj.team);
    }
    setAllEmploees(allEmplArr);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const category = queryParams.get("category");

    const result = line[activeIndex]?.team?.filter(item =>
      category ? item.department === category : true
    );
    setEmpSliced(result);
  }, [line, window.location.search, activeIndex]);

  const handleClickCategory = category => {
    setLocation(category);
    const queryParams = new URLSearchParams({ category });
    navigate(`?${queryParams.toString()}`);
  };

  useEffect(() => {
    allEmpl();
    filteredDepartment();
    const tabNavigationLinks = Array.from(
      tabsRef.current.querySelectorAll(".c-tabs-nav__link")
    );

    const clickHandlerSetup = (link, index) => {
      link.addEventListener("click", e => {
        e.preventDefault();
        setActiveIndex(index);
      });
    };

    tabNavigationLinks.forEach((link, index) => {
      clickHandlerSetup(link, index);
    });
  }, [activeIndex]);

  console.log(uniqueTeams);

  return (
    <>
      {line !== null ? (
        <section id="page">
          <div id="tabs" className="custom-tabs" ref={tabsRef}>
            <div className="c-tabs-nav">
              {line?.map((text, index) => (
                <a
                  href="javascript:void(0);"
                  className={`c-tabs-nav__link team_nav_link ${
                    index === activeIndex ? "is-active" : ""
                  }`}
                  key={index}
                  onClick={() => setActiveIndex(index)}>
                  {text[`title_${language}`]}
                </a>
              ))}
              <div
                className="c-tab-nav-marker"
                style={{
                  transform: `translateX(calc(${activeIndex} * (100% / ${line.length})))`,
                }}></div>
            </div>

            <div className="custom-swiper-team-wrapper">
              {line?.map((item, index) => (
                <div
                  className={`custom-tab ${
                    index === activeIndex ? "is-active" : ""
                  }`}
                  key={index}>
                  {index === activeIndex && ( // Отображение только для активного направления
                    <>
                      <div className="filterd_button">
                        <button
                          className={`projects_${
                            !location ? "active" : "res"
                          } projects_category`}
                          onClick={() => handleClickCategory("")}>
                          Все
                        </button>
                        {uniqueTeams.map(item => {
                          const departmentHasEmployees = line[
                            activeIndex
                          ]?.team?.some(
                            content => content.department === item.department
                          );

                          if (departmentHasEmployees) {
                            return (
                              <button
                                className={`projects_${
                                  location === item.department
                                    ? "active"
                                    : "res"
                                } projects_category`}
                                key={item.id}
                                onClick={() =>
                                  handleClickCategory(item.department)
                                }>
                                {item.department}
                              </button>
                            );
                          }
                          return null;
                        })}
                      </div>
                      <div className="swiper_team_wrapper">
                        {emplSliced?.map(content => (
                          <>
                            <div className="custom-swiper-content">
                              <div className="custom-img-content-wrapper">
                                <img src={content.main_picture} alt="" />
                              </div>
                              <div className="custom-siper-content-left custom-swiper-left">
                                <h3
                                  dangerouslySetInnerHTML={{
                                    __html: content[`name_${language}`],
                                  }}></h3>
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: content[`status_${language}`],
                                  }}></p>
                                <button
                                  onClick={() => toggleDropdown(content.id)}>
                                  {openDropdownId === content.id ? "-" : "+"}
                                </button>
                              </div>
                              {openDropdownId === content.id && (
                                <>
                                  <DropDownCard
                                    employee={content}
                                    isClosing={isClosing}
                                    closingDropdownId={closingDropdownId}
                                  />
                                </>
                              )}
                            </div>
                          </>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default CtabMissionValues;
