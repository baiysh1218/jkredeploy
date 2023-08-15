import React, { useContext, useEffect, useRef, useState } from "react";
import { pageContext } from "../../contexts/PageContext/PageContext";
import Loader from "../loader/Loader";
import "./style/Partners.css";
import close from "../../assets/icons/close.png";

const Partners = ({ marker }) => {
  const tabsRef = useRef(null);

  const { teamAll, getPartners, partners, partnersInfo, language } =
    useContext(pageContext);

  useEffect(() => {
    getPartners();
  }, []);

  const [openEmployee, setOpenEmployee] = useState(null); // State для отслеживания открытого сотрудника

  const handleEmployeeClick = employee => {
    setOpenEmployee(employee); // Устанавливаем выбранного сотрудника в состояние, чтобы открыть модалку с его данными
  };

  const handleCloseModal = () => {
    setOpenEmployee(null); // Закрываем модалку путем очистки состояния
  };

  return (
    <>
      {partners && partnersInfo ? (
        <>
          {/* <div className="partner_main_picture_wrapper">
            <img src={partnersInfo?.main_picture} alt="" />
          </div>
          <div className="custom-partners-wrapper-head">
            <h3>{partnersInfo[`sub_title_${language}`]}</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: partnersInfo[`description_${language}`],
              }}></p>
          </div> */}
          <div
            style={{ backgroundImage: `url(${partnersInfo.main_picture})` }}
            className="history_company_wrapper_img">
            <h2>{partnersInfo[`sub_title_${language}`]}</h2>
            <div className="history_company_wrapper_content">
              <h4>{partnersInfo[`title_other`]}</h4>
              <p
                dangerouslySetInnerHTML={{
                  __html: partnersInfo[`description_${language}`],
                }}></p>
            </div>
          </div>

          <div className="custom-partners-tabs" ref={tabsRef}>
            {partners.map(employee => (
              <div
                onClick={() => handleEmployeeClick(employee)} // Изменено: Вызываем функцию обработки клика
                key={employee.id}
                className={`partners`}>
                <img src={employee.main_picture} alt="" />

                <h4>{employee[`title_${language}`]}</h4>
                <p
                  dangerouslySetInnerHTML={{
                    __html: employee[`description_${language}`],
                  }}></p>
              </div>
            ))}
          </div>

          {openEmployee && ( // Отображаем модалку только если openEmployee установлен
            <div className={`partners_modal open`}>
              <img
                className="partner_modal_img"
                src={openEmployee.main_picture}
                alt=""
              />
              <h4>{openEmployee[`title_${language}`]}</h4>
              <p
                dangerouslySetInnerHTML={{
                  __html: openEmployee[`description_${language}`],
                }}></p>
              <button onClick={handleCloseModal}>
                <img width={"35px"} src={close} alt="" />
              </button>
            </div>
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Partners;
