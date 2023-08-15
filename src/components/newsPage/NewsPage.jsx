import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pageContext } from "../../contexts/PageContext/PageContext";
import Loader from "../loader/Loader";
import "../newsInfo/style/NewsInfo.css";
import "./News.css";

const NewsPage = () => {
  const { postsAll, language, getPosts, posts } = useContext(pageContext);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [postSliced, setPostsSliced] = useState([]);
  const [random, setRandom] = useState({});
  const [location, setLocation] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const category = queryParams.get("category");

    const result = posts.data?.filter(item =>
      category ? item.category === category : true
    );

    setPostsSliced(result);
  }, [posts.data, location]);

  const handleMouseEnter = () => {
    setIsOverlayVisible(true);
  };

  const handleMouseLeave = () => {
    setIsOverlayVisible(false);
  };

  const handleCategoryClick = category => {
    setLocation(category);
    const queryParams = new URLSearchParams({ category });
    navigate(`?${queryParams.toString()}`);
  };

  console.log(posts);

  return (
    <>
      {posts ? (
        <>
          <div className="filterd_button">
            <button
              className={`projects_${
                !location ? "active" : "res"
              } projects_category`}
              onClick={() => handleCategoryClick("")}>
              Все
            </button>
            {posts.data?.map(category => (
              <button
                key={category.id}
                className={`projects_${
                  location === category.category ? "active" : "res"
                } projects_category`}
                onClick={() => handleCategoryClick(category.category)}>
                {category.category}
              </button>
            ))}
          </div>
          <section
            className="news_wrapper news_page_wrapper"
            style={{
              backgroundImage: `url(${posts?.info?.background_image})`,
            }}>
            <div className="news_info_card_wrapper">
              {postSliced?.map(item => (
                <div
                  key={item.id}
                  className="news_content_table"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}>
                  <div className="news_content_item news_card">
                    <h3
                      dangerouslySetInnerHTML={{ __html: item.category }}></h3>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: item[`content_${language}`],
                      }}></p>
                  </div>
                  <div
                    className={`news_content_overlay ${
                      isOverlayVisible ? "visible" : "leave"
                    }`}
                    style={{ backgroundImage: `url(${item.image})` }}></div>
                  <button
                    onClick={() => navigate(`/project/details/${item.id}`)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi bi-arrow-right"
                      viewBox="0 0 16 16">
                      <path
                        fillRule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
          <div className="news_bottom"></div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default NewsPage;
