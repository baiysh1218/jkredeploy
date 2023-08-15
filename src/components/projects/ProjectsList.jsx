import React, { useContext, useEffect, useState } from "react";
// import ProductCard from "./ProductCard";
import "./style/Projects.css";

import { pageContext } from "../../contexts/PageContext/PageContext";
import ProjectCard from "./ProjectCard";
import Loader from "../loader/Loader";

const ProductsList = () => {
  const { getPosts, posts, filteredPosts, category, projects, lines } =
    useContext(pageContext);
  const [currentCategory, setCurrentCategory] = useState("");

  const [location, setLocation] = useState(null);

  const [projectsFiltered, setFilteredProjects] = useState(null);

  const [firsMount, setFirstMount] = useState("");

  const [sortedProjects, setSortedProjects] = useState([]);

  useEffect(() => {
    const uniqueObjects = projects?.filter(
      (obj, index, self) => index === self.findIndex(o => o.lines === obj.lines)
    );
    setSortedProjects(uniqueObjects);
  }, [projects]);

  useEffect(() => {
    if (firsMount) {
      return;
    }
    const loc =
      window.location.search.split("=") && window.location.search.split("=")[1];
    const decode = decodeURIComponent(loc);
    const result = projects?.filter(item => item.lines === decode);
    setFilteredProjects(result);
    setLocation(decode);
  }, [window.location.search]);

  // useEffect(() => {
  //   getPosts();
  //   setCurrentCategory(getCurrentCategoryFromUrl());
  // }, []);

  // const getCurrentCategoryFromUrl = () => {
  //   const queryParams = window.location.search.substr(1);
  //   const queryParamsArray = queryParams.split("&");
  //   for (let i = 0; i < queryParamsArray.length; i++) {
  //     const [key, value] = queryParamsArray[i].split("=");
  //     if (key === "category") {
  //       return value;
  //     }
  //   }
  //   return "";
  // };

  const handleCategoryClick = category => {
    setCurrentCategory(category);
    const queryParams = `category=${encodeURIComponent(category)}`;
    window.history.pushState(null, null, `?${queryParams}`);
    filteredPosts(category);
  };

  return (
    <>
      {projects ? (
        <div style={{ paddingTop: "40px" }} className="projects_main_wrapper">
          <div className="filterd_button">
            <button
              className={
                !location
                  ? "projects_active projects_category"
                  : "projects_res projects_category"
              }
              onClick={() => {
                setFilteredProjects(projects);
                handleCategoryClick("");
              }}>
              Все
            </button>
            {sortedProjects?.map(item => (
              <React.Fragment key={item.lines}>
                {/* <div className="line"></div> */}
                <button
                  onClick={() => handleCategoryClick(item.lines)}
                  className={
                    location === item.lines
                      ? "projects_active projects_category"
                      : "projects_res projects_category"
                  }>
                  {item.lines}
                </button>
              </React.Fragment>
            ))}
          </div>
          <div className="products_wrapper">
            {projectsFiltered?.length
              ? projectsFiltered?.map(item => (
                  <ProjectCard item={item} key={item.id} />
                ))
              : projects?.map(item => (
                  <ProjectCard item={item} key={item.id} />
                ))}
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

export default ProductsList;
