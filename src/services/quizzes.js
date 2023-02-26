import axios from "axios"
import { accessToken, getCourseVariant } from "./moocfi"

export async function fetchQuizzesProgress() {
  const { quizzesId } = await getCourseVariant()
  const response = await axios.get(
    `https://quizzes.mooc.fi/api/v2/general/course/${quizzesId}/progress`,
    { headers: { Authorization: `Bearer ${accessToken()}` } },
  )
  return response.data
}

export async function fetchQuizNames() {
  const { quizzesId } = await getCourseVariant()
  const response = await axios.get(
    `https://quizzes.mooc.fi/api/v2/general/course/${quizzesId}/quiz-titles`,
  )
  return response.data
}
