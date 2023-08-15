import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom/dist";
import { pageContext } from "../../contexts/PageContext/PageContext";
import CtabMissionValues from "../layout/cTabMissionValues/CtabMissionValues";
import Loader from "../loader/Loader";

import "./style/TeamPage.css";

const TeamPage = () => {
  const navigate = useNavigate();
  const {
    companyContent,
    getCompanyAll,
    getOneCompany,
    line,
    language,
    teamPage,
  } = useContext(pageContext);

  return companyContent ? (
    <>
      <div className="our_team_page_wrapper">
        <div className="our_team_page_content_wrapper">
          <div className="our_team_page_img">
            <img src={teamPage?.main_picture} alt="" />
          </div>
          <div className="team_stucture_pic">
            <img src={teamPage?.corporate_structure_picture} alt="" />
          </div>
          {/* <div className="our_team_page_button_wrapper">
            {line.map(item => (
              <button
                className="our_team_page_button"
                key={item.id}
                onClick={() => getOneCompany(item)}>
                {item[`title_${language}`]}
              </button>
            ))}
          </div> */}
          {line !== null && <CtabMissionValues />}
        </div>
      </div>
    </>
  ) : (
    <>
      <Loader />
    </>
  );
};

export default TeamPage;
