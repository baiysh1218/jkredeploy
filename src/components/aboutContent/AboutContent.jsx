import React, { useContext } from "react";
import { pageContext } from "../../contexts/PageContext/PageContext";
import Loader from "../loader/Loader";

import "./style/AboutContent.css";

const AboutContent = () => {
  const { about, language } = useContext(pageContext);
  const [aboutContent] = about;

  return (
    <>
      {aboutContent ? (
        <div className="about_container">
          <div className="about_wrapper_img">
            <img src={aboutContent?.picture} alt="" />
            <div className="about_img_block">
              <h3>{aboutContent[`subtitle_${language}`]}</h3>
              {/* Заголовок подзаголовка */}
            </div>
            <div className="about_img_content">
              <p
                dangerouslySetInnerHTML={{
                  __html: aboutContent[`description_${language}`],
                }}></p>
              {/* Текстовое содержимое */}
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default AboutContent;
