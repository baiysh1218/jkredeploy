import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { pageContext } from "../../contexts/PageContext/PageContext";
import Carousel from "../carousel/Carousel";
import Loader from "../loader/Loader";
import SCtab from "./SCtab";
import "./style/Section.css";

const Section = () => {
  const [isLoader, setIsLoader] = useState(true);

  const { id } = useParams();

  const { line, main, language } = useContext(pageContext);

  const [data] = line.filter(item => item.id === +id);

  useEffect(() => {
    setTimeout(() => {
      setIsLoader(false);
    }, 1000);
  }, [main]);

  return (
    <>
      {!data ? (
        <>
          <Loader />
        </>
      ) : (
        <div className="section_wrapper">
          <div className="section_head_content">
            <h2>{data[`title_${language}`]}</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: data[`description_${language}`],
              }}></p>
          </div>
          <div className="carousel_section">
            <SCtab data={data} />
          </div>
        </div>
      )}
    </>
  );
};

export default Section;
