import React, { useContext, useEffect } from "react";
import { pageContext } from "../../contexts/PageContext/PageContext";
import Carousel from "../carousel/Carousel";
import CardAnimation from "../layout/cardAnimation/CardAnimation";
import Loader from "../loader/Loader";

import "./style/History.css";

const History = () => {
  const { history, getHistory, language } = useContext(pageContext);

  useEffect(() => {
    getHistory();
  }, []);

  console.log("history", history);

  return (
    <>
      {history ? (
        <>
          <div
            style={{ backgroundImage: `url(${history[0].main_picture})` }}
            className="history_company_wrapper_img">
            <h2>{history[0][`title_${language}`]}</h2>

            <div className="history_company_wrapper_content">
              <h4>{history[0][`title_other`]}</h4>
              <p
                dangerouslySetInnerHTML={{
                  __html: history[0][`description_other`],
                }}></p>
            </div>
          </div>
          {/* <div className="content_other">
            <h4>{history[0][`sub_title_${language}`]}</h4>
            <p
              dangerouslySetInnerHTML={{
                __html: history[0][`description_${language}`],
              }}></p>
            </div> */}
          {/* <div className="history_other_content">
            <p
              dangerouslySetInnerHTML={{
                __html: history[0][`description_other_${language}`],
              }}></p>
          </div> */}
          <CardAnimation />
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default History;
