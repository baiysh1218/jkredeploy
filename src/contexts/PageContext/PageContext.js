import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom/dist";

export const pageContext = React.createContext();

const checkAndSetDefaultLanguage = () => {
  const storedLanguage = localStorage.getItem("language");

  if (!storedLanguage) {
    // Если в localStorage нет языка, устанавливаем по умолчанию "ru"
    localStorage.setItem("language", "ru");
    return "ru";
  } else {
    // Если в localStorage уже есть язык, возвращаем его
    return storedLanguage;
  }
};

const INIT_STATE = {
  company: [],
  teamAll: [],
  main: [],
  line: [],
  currentCompany: [],
  posts: [],
  postsAll: [],
  history: null,
  oneCompany: [],
  onePost: null,
  mission: [],
  stats: [],
  about: null,
  career: null,
  language: checkAndSetDefaultLanguage(),
  search: "",
  searchContent: null,
  partners: null,
  partnersInfo: null,
  teamPage: null,
  vacancies: null,
  projects: null,
};

function reducer(state = INIT_STATE, action) {
  switch (action.type) {
    case "GET_COMPANY":
      return { ...state, company: action.payload };
    case "GET_TEAM_INFO":
      return { ...state, teamAll: action.payload };
    case "GET_MAIN_CONTENT":
      return { ...state, main: action.payload };
    case "GET_LINE_CONTENT":
      return { ...state, line: action.payload };
    case "GET_CURRENT_COMPANY":
      return { ...state, currentCompany: action.payload };
    case "GET_POSTS":
      return { ...state, posts: action.payload };
    case "GET_FILTERED_POSTS":
      return { ...state, posts: action.payload };
    case "GET_CATEGORY":
      return { ...state, category: action.payload };
    case "POSTS_ALL":
      return { ...state, postsAll: action.payload };
    case "GET_HISTORY":
      return { ...state, history: action.payload };
    case "GET_ONE_COMPANY":
      return { ...state, oneCompany: action.payload };
    case "GET_ONE_POSTS":
      return { ...state, onePost: action.payload };
    case "GET_MISSION":
      return { ...state, mission: action.payload };
    case "GET_STATS":
      return { ...state, stats: action.payload };
    case "CHANGE_LANGUAGE":
      return { ...state, language: action.payload };
    case "GET_CAREER":
      return { ...state, career: action.payload };
    case "SEARCH":
      return { ...state, search: action.payload };
    case "GET_SEARCH_CONTENT":
      return { ...state, searchContent: action.payload };
    case "GET_ABOUT":
      return { ...state, about: action.payload };
    case "GET_PARTNERS":
      return { ...state, partners: action.payload };
    case "GET_PARTNERS_INFO":
      return { ...state, partnersInfo: action.payload };
    case "GET_TEAM_PAGE":
      return { ...state, teamPage: action.payload };
    case "VACANCIES":
      return { ...state, vacancies: action.payload };
    case "GET_PROJECTS":
      return { ...state, projects: action.payload };

    default:
      return state;
  }
}

const API = "https://jk-group-production.up.railway.app";

const PageContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  const [companyOne, setCompanyOne] = useState(null);

  const navigate = useNavigate();

  async function handleSearch(search) {
    try {
      const result = await axios(
        `${API}/${state.language}/en/main/?search=${search}`
      );
      dispatch({ type: "SEARCH", payload: result.data });
    } catch (error) {
      console.error(error);
    }
  }

  function changeLanguageGlobal(language) {
    dispatch({ type: "CHANGE_LANGUAGE", payload: language });
  }

  async function getAboutUs() {
    try {
      const result = await axios(`${API}/${state.language}/about`);
      dispatch({ type: "GET_ABOUT", payload: result.data });
    } catch (error) {
      console.error(error);
    }
  }

  async function getCompanyAll() {
    try {
      const result = await axios(`${API}/${state.language}/company/all/`);

      dispatch({
        type: "GET_COMPANY",
        payload: result.data.results,
      });

      let allMissions = [];
      result.data.results.forEach(result => {
        if (result.mission && result.mission.length > 0) {
          allMissions = [...allMissions, ...result.mission];
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getTeamInfoAll() {
    try {
      const result = await axios(`${API}/${state.language}/team/all/`);

      dispatch({
        type: "GET_TEAM_INFO",
        payload: result.data.data.results,
      });
      dispatch({
        type: "GET_TEAM_PAGE",
        payload: result.data.info,
      });
    } catch (error) {
      console.error(error);
    }
  }

  function getOneCompany(item) {
    setCompanyOne(item);
    navigate(`/team/structure/${item[`title_${state.language}`]}`);
  }

  const handleFiltered = clickedItem => {
    const filteredLines = state.line.filter(item => {
      return item[`title_${state.language}`] == clickedItem.item;
    });
    dispatch({ type: "GET_CURRENT_COMPANY", payload: filteredLines });
  };

  async function getMainContent() {
    try {
      const result = await axios(`${API}/en/main`);

      dispatch({ type: "GET_MAIN_CONTENT", payload: result.data });

      dispatch({ type: "GET_STATS", payload: result.data[0].statistics });
    } catch (error) {
      console.error(error);
    }
  }

  async function getLine() {
    try {
      const result = await axios(`${API}/en/line/all`);
      dispatch({ type: "GET_LINE_CONTENT", payload: result.data });
    } catch (error) {
      console.error(error);
    }
  }

  async function getPosts() {
    try {
      const result = await axios(`${API}/${state.language}/posts/all`);

      const newUrl = window.location.pathname;
      window.history.pushState(null, null, newUrl);

      dispatch({ type: "GET_POSTS", payload: result.data });
      dispatch({ type: "POSTS_ALL", payload: result.data });

      console.log(result);

      const uniqueData = result.data.data.filter((item, index, arr) => {
        const firstIndex = arr.findIndex(obj => obj.category === item.category);
        return firstIndex === index;
      });

      dispatch({ type: "GET_CATEGORY", payload: uniqueData });
    } catch (error) {
      console.error(error);
    }
  }

  async function filteredPosts(category) {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("category", decodeURIComponent(category));
      const queryParams = searchParams.toString();

      const result = await axios(
        `${API}/${state.language}/posts/all/?${queryParams}`
      );
      dispatch({ type: "GET_FILTERED_POSTS", payload: result.data.results });
    } catch (error) {
      console.error(error);
    }
  }

  async function getHistory() {
    try {
      const result = await axios(`${API}/${state.language}/history/all/`);
      dispatch({ type: "GET_HISTORY", payload: result.data });
    } catch (error) {
      console.error(error);
    }
  }

  async function getOneCompanyId(id) {
    try {
      const result = await axios(`${API}/${state.language}/line/${id}/`);

      dispatch({ type: "GET_ONE_COMPANY", payload: result.data.results });
    } catch (error) {
      console.error(error);
    }
  }

  async function getOneProduct(id) {
    try {
      const result = await axios(`${API}/en/posts/${id}`);
      dispatch({ type: "GET_ONE_POSTS", payload: result.data });
    } catch (error) {
      console.error(error);
    }
  }

  async function getCareer() {
    try {
      const result = await axios(`${API}/${state.language}/career/all`);
      dispatch({ type: "GET_CAREER", payload: result.data[0] });
    } catch (error) {
      console.error(error);
    }
  }

  async function getPartners() {
    try {
      const result = await axios(`${API}/${state.language}/partners/all`);
      dispatch({ type: "GET_PARTNERS", payload: result.data.data });
      dispatch({
        type: "GET_PARTNERS_INFO",
        payload: result.data.info,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmitForm = async submitData => {
    try {
      await axios.post(
        `${API}/${state.language}/contacts/send-mail/`,
        submitData
      );
    } catch (error) {
      console.error(error);
    }
  };

  // const changeFontFamily = () => {
  //   const elemParagraph = document.querySelectorAll("*");

  //   elemParagraph?.forEach(paragraph => {
  //     if (state.language === "en") {
  //       paragraph.classList.remove("ru");
  //       paragraph.classList.add("en");
  //     } else if (state.language === "ru") {
  //       paragraph.classList.remove("en");
  //       paragraph.classList.add("ru");
  //     } else {
  //       paragraph.classList.remove("en");
  //       paragraph.classList.add("ru");
  //     }
  //   });
  // };

  const getProjects = async () => {
    try {
      const { data } = await axios(`${API}/${state.language}/projects/all`);
      dispatch({ type: "GET_PROJECTS", payload: data.results });
    } catch (error) {
      console.error(error);
    }
  };

  const upload = async (upload, id) => {
    try {
      await axios.post(`${API}/${state.language}/contacts/`, {
        cv: upload,
        line: id,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const vacancies = async () => {
    try {
      const result = await axios(`${API}/${state.language}/vacancies/all`);
      dispatch({ type: "VACANCIES", payload: result.data });
    } catch (error) {
      console.error(error);
    }
  };

  const getMission = async () => {
    try {
      const { data } = await axios(`${API}/${state.language}/missions`);
      dispatch({ type: "GET_MISSION", payload: data.results[0] });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCompanyAll();
    getHistory();
    getLine();
    getMainContent();
    getPosts();
    getTeamInfoAll();
    getCareer();

    // changeFontFamily();
    getAboutUs();
    getPartners();
    getProjects();
    getMission();
  }, []);

  useEffect(() => {
    // changeFontFamily();
    getPosts();
  }, [state.language]);

  const value = {
    getCompanyAll,
    getTeamInfoAll,
    getOneCompany,
    getMainContent,
    getLine,
    handleFiltered,
    getPosts,
    filteredPosts,
    getHistory,
    getOneCompanyId,
    getOneProduct,
    changeLanguageGlobal,
    getHistory,
    handleSubmitForm,
    upload,
    getPartners,
    vacancies,

    oneCompany: companyOne,
    teamAll: state.teamAll,
    companyContent: state.company,
    line: state.line,
    main: state.main,
    currentCompany: state.currentCompany,
    posts: state.posts,
    category: state.category,
    postsAll: state.postsAll,
    history: state.history,
    oneCompany: state.oneCompany,
    onePost: state.onePost,
    mission: state.mission,
    stats: state.stats,
    language: state.language,
    career: state.career,
    about: state.about,
    partners: state.partners,
    partnersInfo: state.partnersInfo,
    teamPage: state.teamPage,
    vacanciesAll: state.vacancies,
    projects: state.projects,
    mission: state.mission,
  };

  return <pageContext.Provider value={value}>{children}</pageContext.Provider>;
};

export default PageContextProvider;
