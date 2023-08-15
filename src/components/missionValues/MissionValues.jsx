import React from "react";
import { useContext } from "react";
import { pageContext } from "../../contexts/PageContext/PageContext";
import About from "../about/About";
import CtabCarousel from "../cTabCarousel/CtabCarousel";
import CtabMissionValues from "../layout/cTabMissionValues/CtabMissionValues";
import Loader from "../loader/Loader";

import "./style/MissionValues.css";

const MissionValues = () => {
  const { mission, language } = useContext(pageContext);
  console.log(mission);
  return (
    <>
      {mission ? (
        // <div>
        //   <div className="mission_values_wrapper">
        //     <div className="mission_values_image_wrapper">
        //       <img src={mission.main_picture} alt="" />
        //       <div className="mission_values_content">
        //         <h5>{mission[`title_${language}`]}</h5>
        //         <div className="mission_extra_content">
        //           <h6>{mission[`sub_title_${language}`]}</h6>
        //           <p
        //             dangerouslySetInnerHTML={{
        //               __html: mission[`description_${language}`],
        //             }}></p>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <div
          style={{ backgroundImage: `url(${mission.main_picture})` }}
          className="history_company_wrapper_img">
          <h2>{mission[`title_${language}`]}</h2>

          <div className="history_company_wrapper_content">
            <h4>{mission[`title_other`]}</h4>
            <p
              dangerouslySetInnerHTML={{
                __html: mission[`description_${language}`],
              }}></p>
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

export default MissionValues;
