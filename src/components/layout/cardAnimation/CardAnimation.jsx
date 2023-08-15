import React, { useContext, useEffect, useState } from "react";
import { pageContext } from "../../../contexts/PageContext/PageContext";
import Loader from "../../loader/Loader";
import "./style/CardAnimation.css";

const CardAnimation = ({ cardContent }) => {
  const [animatedCards, setAnimatedCards] = useState([]);

  const { history, language } = useContext(pageContext);

  const [historyContent] = history;

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const cardWrapper = document.querySelector(".company_card_wrapper");

    if (cardWrapper) {
      const wrapperTop = cardWrapper.offsetTop;
      const scrollOffset = window.innerHeight * 0.5;

      if (
        scrollTop >= wrapperTop - scrollOffset &&
        !animatedCards.includes("company_card_wrapper")
      ) {
        setAnimatedCards(["company_card_wrapper"]); // Здесь мы просто заменяем массив, так как нам нужно добавить анимацию только к элементам внутри company_card_wrapper
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {historyContent ? (
        <div className="container_card_animation">
          <div className="card_animation_wrapper">
            <div className="card_animation_content">
              <h2>{historyContent[`title_${language}`]}</h2>
              <p
                dangerouslySetInnerHTML={{
                  __html: historyContent[`description_${language}`],
                }}></p>
            </div>
            <div className="card_content_wrapper">
              {historyContent.extra.map((cardItem, index) => (
                <div
                  className={`card_animation ${
                    animatedCards.includes("company_card_wrapper")
                      ? "animate"
                      : ""
                  }`}
                  style={{ margin: `${index * 10}px 0` }}
                  key={index}>
                  {cardItem.picture && <img src={cardItem.picture} alt="" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <Loader />
        </>
      )}
    </>
  );
};

export default CardAnimation;
