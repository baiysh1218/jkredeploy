import React, { useContext, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "./style/cTabCarousel.css";
import SwiperCore, { Navigation } from "swiper/core";
import { pageContext } from "../../contexts/PageContext/PageContext";
import Loader from "../loader/Loader";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./style/cTabCarousel.css";
import { Pagination } from "swiper";

SwiperCore.use([Navigation]);

const LineCarousel = ({ marker }) => {
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
      <div id="tabs tabs_line" className="c-tabs c-tabs_line" ref={tabsRef}>
        <div className="c-tabs-nav c-tab-nav-line">
          {line?.map((text, index) => {
            if (text.extra_fields) {
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

        <div className="line_wrapper">
          {line?.map((item, index) => {
            if (item.extra_fields) {
              return (
                <div
                  className={`c-tab ${
                    index === activeIndex ? "is-active" : ""
                  }`}
                  style={{ height: "auto" }}
                  key={index}>
                  <Swiper
                    direction={"vertical"}
                    ref={swiperRef}
                    navigation={true}
                    className="mySwiper"
                    modules={[Pagination]}
                    pagination={{ clickable: true }}>
                    {item.extra_fields.map(content => {
                      if (typeof content === "object" && content) {
                        return (
                          <SwiperSlide key={content.id}>
                            <div className="swiper_content_line">
                              <div className="content_carousel">
                                <h2>{content[`sub_title_${language}`]}</h2>{" "}
                                {/* Заголовок */}
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: content[`description_${language}`],
                                  }}></p>
                                {/* Описание с использованием dangerouslySetInnerHTML */}
                                <button
                                  onClick={() =>
                                    navigate(`/team/section/${item.id}`)
                                  }>
                                  {t("projects")}
                                </button>
                              </div>
                              <div className="carousel_img_wrapper">
                                <img
                                  className="carousel_img_line"
                                  src={content?.picture}
                                  alt=""
                                />
                                {/* Изображение */}
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
      </div>
    </section>
  );
};

export default LineCarousel;
