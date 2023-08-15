import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { pageContext } from "../../contexts/PageContext/PageContext";
import Carousel from "../carousel/Carousel";
import FormConnect from "../formConnect/FormConnect";

import "./style/Company.css";

const Company = () => {
  const { currentCompany, companyContent, oneCompany } =
    useContext(pageContext);
  const { id } = useParams();
  const [cardAnimation, setCardAnimation] = useState([]);

  useEffect(() => {
    // Здесь можно добавить логику для получения данных компании по id
    // например, вызвать функцию из контекста или отправить запрос к API

    // Симулируем получение данных и вычисление анимаций для карточек
    const animations = companyContent.map((_, index) => ({
      animationName: `animationCard${index + 1}`,
      animationDuration: `${0.3 + index * 0.2}s`,
      left: `${50 + index * 130}px`,
      top: `${80 + index * 100}px`,
    }));
    setCardAnimation(animations);
  }, [id, companyContent]);

  return (
    <>
      <div className="company_main_wrapper">
        <div className="company_content_text_wrapper">
          <h2>{currentCompany?.name}</h2>
          <h4>{currentCompany?.group}</h4>
        </div>
        <div className="company_main_card">
          {currentCompany?.images.map((img, index) => {
            if (typeof img === "object") {
              return (
                <div
                  key={index}
                  className="company_main_card_item"
                  style={{
                    backgroundImage: `url(${img?.image})`,
                    ...cardAnimation[index],
                  }}></div>
              );
            }
          })}
        </div>
      </div>
      <Carousel data={currentCompany} />
      <FormConnect />
    </>
  );
};

export default Company;
