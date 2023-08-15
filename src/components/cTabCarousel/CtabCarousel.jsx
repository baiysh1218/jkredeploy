import React, { useContext, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "./style/cTabCarousel.css";
import SwiperCore, { Navigation } from "swiper/core";
import { pageContext } from "../../contexts/PageContext/PageContext";
import Loader from "../loader/Loader";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

SwiperCore.use([Navigation]);

const CtabCarousel = ({ marker }) => {
  const tabsRef = useRef(null);
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { line, language } = useContext(pageContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const tabNavigationLinks =
      tabsRef.current.querySelectorAll(".c-tabs-nav__link");

    const goToTab = index => {
      if (
        index >= 0 &&
        index !== activeIndex &&
        index < tabNavigationLinks.length
      ) {
        tabNavigationLinks.forEach((link, linkIndex) => {
          if (linkIndex === activeIndex) {
            link.classList.remove("is-active");
          } else if (linkIndex === index) {
            link.classList.add("is-active");
          }
        });
        setActiveIndex(index);
      }
    };

    const clickHandlerSetup = (link, index) => {
      link.addEventListener("click", e => {
        e.preventDefault();
        goToTab(index);
      });
    };

    tabNavigationLinks.forEach((link, index) => {
      clickHandlerSetup(link, index);
    });
  }, [activeIndex]);

  return (
    <section id="page">
      <div id="tabs" className="c-tabs" ref={tabsRef}>
        <div className="c-tabs-nav">
          {line?.map((text, index) => {
            if (text.projects?.length) {
              return (
                <a
                  href="javascript:void(0);"
                  className={`c-tabs-nav__link ${
                    index === activeIndex ? "is-active" : ""
                  }`}
                  key={index}
                  onClick={() => setActiveIndex(index)}>
                  {text[`title_${language}`]}
                </a>
              );
            }
            return null;
          })}
          <div
            className="c-tab-nav-marker"
            style={{
              transform: `translateX(calc(${activeIndex} * (100% / ${line.length})))`,
            }}></div>
        </div>

        {line?.map((item, index) => {
          if (item.projects?.length) {
            return (
              <div
                className={`c-tab ${index === activeIndex ? "is-active" : ""}`}
                key={index}>
                <Swiper ref={swiperRef} navigation={true} className="mySwiper">
                  {item.projects.map(content => {
                    if (typeof content === "object" && content) {
                      return (
                        <SwiperSlide key={content.id}>
                          <div className="swiper_content">
                            <div className="siper_content_left">
                              <div className="swiper_left_img_wrapper">
                                <img
                                  id="swiper_img_left"
                                  src={content.picture_other}
                                  alt=""
                                />
                              </div>
                              <div className="swiper_ccontent_left">
                                <h3
                                  dangerouslySetInnerHTML={{
                                    __html: content[`title_${language}`],
                                  }}></h3>
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: content[`description_${language}`],
                                  }}></p>
                              </div>
                            </div>
                            <div className="swiper_content_right">
                              <img src={content?.picture} alt="" />
                              <div className="swiper_content_right_block">
                                <h6>{content.title}</h6>
                                <div className="projects_line"></div>
                                <p>
                                  {content.year}&nbsp;-&nbsp;{t("years")}
                                </p>
                                <div className="projects_line"></div>
                                <button
                                  onClick={() =>
                                    navigate(`/project/details/P/${content.id}`)
                                  }>
                                  {t("projects")}
                                </button>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      );
                    }
                    return null;
                  })}
                </Swiper>
              </div>
            );
          }
          return null;
        })}
      </div>
    </section>
  );
};

export default CtabCarousel;
