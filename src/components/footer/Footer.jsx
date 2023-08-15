import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import "./style/Footer.css";
import logo from "../../assets/icons/JKGroup_black_nav_logo.png";
import { pageContext } from "../../contexts/PageContext/PageContext";

const Footer = () => {
  const { line, projects } = useContext(pageContext);
  const { t } = useTranslation();
  console.log(projects);
  return (
    <>
      <footer className="footer">
        <div className="footer-top-box">
          <div className="footer-box-card">
            <h3>{t("footer.line")}</h3>

            {line?.map(item => (
              <p>{item.title}</p>
            ))}
          </div>
          <div className="footer-box-card">
            <h3>{t("footer.projects")}</h3>
            {projects?.map(item => (
              <p>{item.title}</p>
            ))}
          </div>
          <div className="footer-box-card">
            <h3>{t("footer.shortCusts")}</h3>
            {/* <a>{t("contentTitle")}</a>
            <a href="#">{t("history")}</a>
            <a href="#">{t("mission values")}</a>
            <a href="#">{t("navbar.team")}</a>
            <a href="#">{t("navbar.partners")}</a>
            <a href="#">достижения</a> */}
          </div>
        </div>
        <div className="footer-bottom-box">
          <ul>
            <li>
              <span>© 2023 Sweco AB</span>
            </li>
            <li>Cookie policy</li>
            <li>Data privacy</li>
            <li>Manage consent</li>
          </ul>

          <a id="btn-to-top-text" href="#top">
            {t("footer.back")}
          </a>
          <div id="footer-logo">
            <img src={logo} alt="" />
          </div>
        </div>
        <a href="#top">
          <button className="green-btn-arrow footer-green-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-up"
              viewBox="0 0 16 16">
              <path
                fillRule="evenodd"
                d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
              />
            </svg>
          </button>
        </a>
      </footer>
    </>
  );
};

export default Footer;
