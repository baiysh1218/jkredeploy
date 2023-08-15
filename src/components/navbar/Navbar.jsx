import React, { startTransition, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./style/Navbar.css";
import "../../adaptive.css";

import JKLogo from "../../assets/icons/JKGroup_black_nav_logo.png";

import arrow from "../../assets/icons/down-arrow.png";
import DropdownContent from "../layout/dropdownContent/DropdownContent";
import { pageContext } from "../../contexts/PageContext/PageContext";
import { useDebounce } from "@uidotdev/usehooks";

import { useTranslation } from "react-i18next";
import i18n from "../../language/i18n";

import language_en from "../../language/language/en.json";
import language_ru from "../../language/language/ru.json";
import language_ky from "../../language/language/ky.json";
import axios from "axios";
import { useRef } from "react";

const Navbar = () => {
  const { line, changeLanguageGlobal, language } = useContext(pageContext);

  const { t } = useTranslation();

  const languagesObj = {
    en: language_en,
    ru: language_ru,
    ky: language_ky,
  };

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [indexDropDown, setIndexDropDown] = useState(null);
  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchContent, setSearchContent] = useState(null);
  const [seacrhForMap, setSearchForMap] = useState(null);
  const [isSearhcOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Added state for the menu
  const searchContainerRef = useRef(null);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close the menu when the component unmounts
  useEffect(() => {
    return () => {
      setIsMenuOpen(false);
    };
  }, []);

  const handleToggleSearch = () => {
    startTransition(() => {
      setSearchOpen(!isSearchOpen);
    });
  };

  const handleClickOutsideDropdowns = event => {
    const languageDropdown = document.querySelector(".language-dropdown");
    if (languageDropdown && !languageDropdown.contains(event.target)) {
      setIsDropdownOpen(false);
    }

    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target)
    ) {
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    // Add the event listener when the component mounts
    document.addEventListener("click", handleClickOutsideDropdowns);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutsideDropdowns);
    };
  }, []);

  useEffect(() => {
    if (!isSearchOpen) {
      const timer = setTimeout(() => {
        setSearchOpen(false);
      }, 300); // Задержка соответствует времени анимации (300ms)
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  const handleLanguageSelect = language => {
    // Здесь вы можете обработать выбор языка, например, отправить запрос на сервер или установить языковые настройки в приложении.

    localStorage.setItem("language", language);

    const storedLanguage = localStorage.getItem("language");

    if (storedLanguage) {
      changeLanguageGlobal(storedLanguage);
    }

    setIsDropdownOpen(false);
  };

  const debouncedSearchTerm = useDebounce(search, 1000);

  const handleSearchForm = e => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  useEffect(() => {
    const searchHN = async () => {
      if (debouncedSearchTerm) {
        try {
          const searchResult = await axios(
            `https://jk-group-production.up.railway.app/${language}/main/?search=${debouncedSearchTerm}`
          );
          setSearchContent(searchResult.data);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
        }
      }
    };
    searchHN();
  }, [debouncedSearchTerm]);

  console.log(searchContent);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const navigate = useNavigate();

  const toggleDropdown = index => {
    setActiveDropdown(index === activeDropdown ? null : index);
    setIndexDropDown(indexDropDown);
  };

  const toggleDropdownLanguage = () => {
    // Toggle the language dropdown using useTransition to enable smooth animations
    startTransition(() => {
      setIsDropdownOpen(prevState => !prevState);
    });
  };

  const handleClickOutsideLanguageDropdown = event => {
    const languageDropdown = document.querySelector(".language-dropdown");
    if (languageDropdown && !languageDropdown.contains(event.target)) {
      // Close the language dropdown using useTransition to enable smooth animations
      startTransition(() => {
        setIsDropdownOpen(false);
      });
    }
  };

  useEffect(() => {
    // Add the event listener when the component mounts
    document.addEventListener("click", handleClickOutsideLanguageDropdown);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutsideLanguageDropdown);
    };
  }, []);

  return (
    <>
      <div id="top"></div>
      <header>
        <div className="header_wrapper">
          <div
            id="header-logo"
            className="header-logo"
            onClick={() => {
              navigate("/");
              toggleDropdown(indexDropDown);
            }}>
            <img src={JKLogo} alt="" className="nav_logo_mobile" />
          </div>
          <div className="header-content">
            <ul className="header-list">
              {languagesObj[`${language}`].dropDownContent.map(
                (item, index) => (
                  <>
                    <li
                      key={index}
                      onClick={() => toggleDropdown(index)}
                      className={`header-list-item ${
                        activeDropdown === index ? "active" : ""
                      }`}>
                      {item.title}
                      <img
                        src={arrow}
                        alt=""
                        className="arrow_nav"
                        width={"25px"}
                      />
                    </li>
                    {activeDropdown === index && (
                      <DropdownContent
                        toggleDropdown={toggleDropdown}
                        index={index}
                        line={line}
                        setIsMenuOpen={setIsMenuOpen}
                      />
                    )}
                  </>
                )
              )}
              <li
                className="header-list-item"
                onClick={() => {
                  navigate("/products");
                  toggleDropdown(indexDropDown);
                }}>
                {t("navbar.projects")}
                <img src={arrow} alt="" className="arrow_nav" width={"25px"} />
              </li>
              <li
                className="header-list-item"
                onClick={() => {
                  navigate("/team");
                  toggleDropdown(indexDropDown);
                }}>
                {t("navbar.team")}
                <img src={arrow} alt="" className="arrow_nav" width={"25px"} />
              </li>
              <li
                className="header-list-item"
                onClick={() => {
                  navigate("/news");
                  toggleDropdown(indexDropDown);
                }}>
                {t("navbar.news")}
                <img src={arrow} alt="" className="arrow_nav" width={"25px"} />
              </li>
              <li
                className="header-list-item"
                onClick={() => {
                  navigate("/career");
                  toggleDropdown(indexDropDown);
                }}>
                {t("navbar.career")}
                <img src={arrow} alt="" className="arrow_nav" width={"25px"} />
              </li>
            </ul>

            <div
              className={`header-btns ${
                isSearchOpen ? "closeSearch" : "openSearch"
              }`}>
              <div
                className={`search-container ${isSearchOpen ? "close" : ""}`}
                ref={searchContainerRef}>
                <div
                  className={`search-icon ${isSearchOpen ? "open" : "close"}`}
                  onClick={handleToggleSearch}>
                  <svg
                    width="30px"
                    height="30px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"></path>
                  </svg>
                </div>
                <div
                  className={`search-input-container ${
                    isSearchOpen ? "closing" : "active"
                  }`}>
                  <input
                    className="search_input"
                    type="search"
                    placeholder={t("navbar.search")}
                    onChange={handleSearchForm}
                  />
                  <div>
                    {searchContent &&
                      searchContent.map(item => {
                        if (item.lines) {
                          return item.lines.map(line => (
                            <p
                              onClick={() => {
                                navigate(`/project/section/${line.id}`);
                                setSearchContent("");
                                setIsDropdownOpen(true);
                              }}>
                              {line[`title_${language}`]}
                            </p>
                          ));
                        }
                        if (item.REFERS === "NEWS" || "PROJECT") {
                          return (
                            <p
                              onClick={() => {
                                navigate(`project/details/${item.id}`);
                                setSearchContent("");
                                setIsDropdownOpen(true);
                              }}>
                              {item[`title_${language}`]}
                            </p>
                          );
                        }
                      })}
                  </div>
                </div>
              </div>

              <div
                style={
                  isSearchOpen ? { display: "none" } : { display: "block" }
                }
                className="header-btns-contacts">
                <svg
                  width="30px"
                  height="30px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M23 4C23 2.34315 21.6569 1 20 1H4C2.34315 1 1 2.34315 1 4V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V4ZM21 4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4Z"
                    fill="#0F0F0F"
                  />
                  <path
                    d="M16 8C16 10.2091 14.2091 12 12 12C9.79086 12 8 10.2091 8 8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8ZM9.97716 8C9.97716 9.11719 10.8828 10.0228 12 10.0228C13.1172 10.0228 14.0228 9.11719 14.0228 8C14.0228 6.88281 13.1172 5.97716 12 5.97716C10.8828 5.97716 9.97716 6.88281 9.97716 8Z"
                    fill="#0F0F0F"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.39909 16.6808C6.49015 13.8286 9.47114 13 12 13C14.5289 13 17.5099 13.8286 18.6009 16.6808C18.9505 17.5948 18.6826 18.4756 18.1363 19.0778C17.6103 19.6576 16.8215 20 16 20H8C7.17849 20 6.38973 19.6576 5.86372 19.0778C5.31737 18.4756 5.04947 17.5948 5.39909 16.6808ZM12 15C9.72346 15 7.89905 15.7433 7.26709 17.3954C7.21826 17.523 7.25506 17.6349 7.34496 17.734C7.47492 17.8772 7.71694 18 8 18H16C16.2831 18 16.5251 17.8772 16.655 17.734C16.7449 17.6349 16.7817 17.523 16.7329 17.3954C16.101 15.7433 14.2765 15 12 15Z"
                    fill="#0F0F0F"
                  />
                </svg>
              </div>

              <button
                style={
                  isSearchOpen ? { display: "none" } : { display: "block" }
                }
                className="languages"
                onClick={toggleDropdownLanguage}>
                <svg
                  width="30px"
                  height="30px"
                  viewBox="0 0 512 512"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg">
                  <g
                    id="Page-1"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd">
                    <g
                      id="icon"
                      fill="#000000"
                      transform="translate(42.666667, 85.333333)">
                      <path
                        d="M426.666667,85.3333333 L426.666667,341.333333 L362.626302,341.333333 L362.666667,405.333333 L256,341.333333 L170.666667,341.333333 L170.666667,85.3333333 L426.666667,85.3333333 Z M256,1.42108547e-14 L256,64 L149.333333,64 L149.333,268.8 L64,320 L64.0403648,256 L6.39488462e-14,256 L6.39488462e-14,1.42108547e-14 L256,1.42108547e-14 Z M311.198683,149.333333 L286.267137,149.333333 L238.933333,277.333333 L261.425923,277.333333 L274.524018,240.658669 L322.580475,240.658669 L335.768901,277.333333 L359.616467,277.333333 L311.198683,149.333333 Z M298.552247,170.741943 C300.501905,177.275935 302.566831,183.717713 304.747024,190.067278 L305.68845,192.782875 L316.43792,223.134321 L280.576241,223.134321 L291.325712,192.782875 C294.336768,184.412138 296.745613,177.065161 298.552247,170.741943 Z M117.030949,34.5391157 L95.6976158,34.5391157 L95.6973576,45.2051157 L42.3642825,45.2057824 L42.3642825,66.5391157 L121.995716,66.5400848 C120.716368,84.7084858 116.106956,101.073346 108.17419,115.733999 C99.560792,103.887475 93.627247,90.6461433 90.3372583,75.9278184 L90.1264414,74.9658328 L69.2687902,79.445732 L70.8337641,85.9582885 C75.5835399,103.786573 83.778254,119.851708 95.3786478,134.061926 C82.7968575,147.638694 64.7668657,157.161751 40.9572973,162.588992 L40.0503576,162.79312 L44.6782074,183.618444 L51.0461873,182.085779 C75.8970327,175.630085 95.7303277,164.729984 110.29054,149.351848 C120.495309,158.153416 133.141117,166.473384 148.224582,174.354521 L149.332601,174.930407 L149.332449,150.637452 C139.011433,144.692193 130.308211,138.579415 123.22105,132.322953 C134.984339,113.206613 141.674551,91.5943352 143.304052,67.6309686 L143.374635,66.540106 L149.332358,66.5391157 L149.332358,45.2051157 L117.030358,45.2051157 L117.030949,34.5391157 Z"
                        id="Combined-Shape"></path>
                    </g>
                  </g>
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="language-dropdown">
                  <ul>
                    <li onClick={() => handleLanguageSelect("en")}>English</li>
                    <li onClick={() => handleLanguageSelect("ru")}>Русский</li>
                    <li onClick={() => handleLanguageSelect("ky")}>Кыргызча</li>
                    {/* Добавьте остальные языки по желанию */}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="burger_button_wrapper">
          <button onClick={handleToggleMenu}>
            <svg
              width="50px"
              height="50px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z"
                fill="#000000"
              />
            </svg>
          </button>
        </div>
      </header>
      <div className={`menu_mobile ${isMenuOpen ? "open" : "none"}`}>
        <ul className="mobile_list">
          {languagesObj[`${language}`].dropDownContent.map((item, index) => (
            <>
              <li
                key={index}
                onClick={() => {
                  toggleDropdown(index);
                  // setIsMenuOpen(false);
                }}
                className={`mobile_list_item ${
                  activeDropdown === index ? "active" : ""
                }`}>
                {item.title}
                <img src={arrow} alt="" className="arrow_nav" width={"15px"} />
              </li>
              {activeDropdown === index && (
                <DropdownContent
                  toggleDropdown={toggleDropdown}
                  index={index}
                  line={line}
                  setIsMenuOpen={setIsMenuOpen}
                />
              )}
            </>
          ))}
          <li
            className="mobile_list_item"
            onClick={() => {
              navigate("/products");
              toggleDropdown(indexDropDown);
              setIsMenuOpen(false);
            }}>
            {t("navbar.projects")}
            <img src={arrow} alt="" className="arrow_nav" width={"15px"} />
          </li>
          <li
            className="mobile_list_item"
            onClick={() => {
              navigate("/team");
              toggleDropdown(indexDropDown);
              setIsMenuOpen(false);
            }}>
            {t("navbar.team")}
            <img src={arrow} alt="" className="arrow_nav" width={"15px"} />
          </li>
          <li
            className="mobile_list_item"
            onClick={() => {
              navigate("/news");
              toggleDropdown(indexDropDown);
              setIsMenuOpen(false);
            }}>
            {t("navbar.news")}
            <img src={arrow} alt="" className="arrow_nav" width={"15px"} />
          </li>
          <li
            className="mobile_list_item"
            onClick={() => {
              navigate("/career");
              toggleDropdown(indexDropDown);
              setIsMenuOpen(false);
            }}>
            {t("navbar.career")}
            <img src={arrow} alt="" className="arrow_nav" width={"15px"} />
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
