import React, { useContext } from "react";
import AboutContent from "../aboutContent/AboutContent";
import Statis from "../layout/StatisLayout/Statis";
import Loader from "../loader/Loader";
import { pageContext } from "../../contexts/PageContext/PageContext";
import { useEffect, useState } from "react";

import "./style/AboutMainContent.css";

const AboutMain = () => {
  const { stats, language, about } = useContext(pageContext);

  const [aboutContent, setAboutContent] = useState(null);

  useEffect(() => {
    if (about) {
      const [aboutDes] = about;
      setAboutContent(aboutDes);
    }
  }, [about]);

  if (!aboutContent) {
    return <Loader />; // Show Loader until the aboutContent is fetched
  }

  return (
    <>
      <AboutContent /> {/* Компонент с содержимым About */}
      <Statis stats={stats} />
      {/* <div className="about_content">
        <h4>{aboutContent[`subtitle_${language}`]}</h4>
        <p
          dangerouslySetInnerHTML={{
            __html: aboutContent[`description_${language}`],
          }}></p>
      </div> */}
      {/* Компонент статистики с передачей данных maxValue */}
      {/* <div className="stats_wrapper_about">
        <h3>Заголовок</h3>
        <p>Место для текста</p>
      </div> */}
    </>
  );
};

export default AboutMain;
