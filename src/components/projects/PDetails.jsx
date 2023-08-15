import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { pageContext } from "../../contexts/PageContext/PageContext";
import Loader from "../loader/Loader";
import PageNotFound from "../pageNotFound/PageNotFound";

const PDetails = () => {
  const { getOneProduct, onePost, postAll, language, projects } =
    useContext(pageContext);

  const [content, setContent] = useState(null);

  const { id } = useParams();

  const getOneProjects = () => {
    // try {
    //   const result = await axios(
    //     `https://jk-group-production.up.railway.app//${language}/projects/${id}`
    //   );
    //   setContent(result);
    // } catch (error) {
    //   console.error(error);
    // }
    const [result] = projects?.filter(item => item.id === +id);
    setContent(result);
  };

  useEffect(() => {
    getOneProjects();
  }, []);

  return (
    <>
      {content ? (
        <div>
          <div className="details_wrapper">
            <div className="details_img_wrapper">
              <img src={content.picture} alt="" />
            </div>
            <div className="details_content">
              <h3>{content[`title_${language}`]}</h3>
              <p
                dangerouslySetInnerHTML={{
                  __html: content[`description_${language}`],
                }}></p>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default PDetails;
