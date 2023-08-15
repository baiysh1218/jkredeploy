import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import "./style/Resume.css";
import { useContext } from "react";
import { pageContext } from "../../contexts/PageContext/PageContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Resume = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const { upload } = useContext(pageContext);

  const [message, setMessage] = useState(""); // Changed variable name

  const { id } = useParams();

  const { t } = useTranslation();

  const fileInputRef = useRef(null);

  const handleDragEnter = event => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = event => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  const handleDrop = async event => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileUpload = async file => {
    const formData = new FormData();
    formData.append("cv", file, "line", +id);

    try {
      const response = await axios.post(
        "https://jk-group-production.up.railway.app/en/vacancies/upload/",
        formData
      );

      setUploadedFile(file);
      setFileUrl(URL.createObjectURL(file));

      setMessage(t("successResume"));
    } catch (error) {
      setMessage(t("rejectedResume"));
    }
  };

  const handleFileInputChange = event => {
    const file = event.target.files[0];
    handleFileUpload(file);
  };

  return (
    <div className="content_resume_wrapper">
      <div className="resume_content">
        <h1>{t("career.resume")}</h1>
      </div>
      {uploadedFile ? (
        <div>
          <p>{message}</p>
        </div>
      ) : (
        <div
          className={`resume_upload ${isDragging ? "dragging" : "load"}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}>
          {t("resume")}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />
    </div>
  );
};

export default Resume;
