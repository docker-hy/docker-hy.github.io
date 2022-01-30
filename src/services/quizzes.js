import axios from "axios";
import { accessToken, getCourseVariant } from "./moocfi";
import CourseSettings from "../../course-settings";

// const id = CourseSettings.quizzesId
const language = CourseSettings.language;

// const quizzesLanguage = language === "en" ? "en_US" : "fi_FI"

export async function fetchQuizzesProgress() {
  const { quizzesId } = await getCourseVariant();
  const response = await axios.get(
    `https://quizzes.mooc.fi/api/v2/general/course/${quizzesId}/progress`,
    { headers: { Authorization: `Bearer ${accessToken()}` } }
  );
  return response.data;
}

export async function fetchQuizNames() {
  const { quizzesId } = await getCourseVariant();
  const response = await axios.get(
    `https://quizzes.mooc.fi/api/v2/general/course/${quizzesId}/quiz-titles`
  );
  return response.data;
}
