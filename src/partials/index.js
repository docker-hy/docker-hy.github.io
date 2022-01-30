// import importAll from 'import-all.macro'

// function getNamedPartials() {
//   const partials = importAll.sync('./*.js')

//   const namedPartials = {}

//   Object.entries(partials)
//     .filter(([k, _]) => k !== './index.js')
//     .forEach(([k, v]) => {
//       const newKey = toKebabCase(k.replace('./', '').replace('.js', ''))
//       namedPartials[newKey] = v.default
//     })

//   function toKebabCase(string) {
//     return string.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
//   }
//   return namedPartials
// }

// export default getNamedPartials

import { OutboundLink } from "gatsby-plugin-google-analytics";

import Test from "./Test";
import PagesInThisSection from "./PagesInThisSection";
import ProgrammingExercise from "./ProgrammingExercise";
import TextBox from "./TextBox";
import SampleData from "./SampleData";
import SampleOutput from "./SampleOutput";
import Youtube from "./Youtube";
import Quiz from "./Quiz";
import Quiznator from "./Quiznator";
import PleaseLogin from "./PleaseLogin";
import FloatImageRight from "./FloatImageRight";
import CodeStatesVisualizer from "./CodeStatesVisualizer";
import PdfSlideshow from "./PdfSlideshow";
import ExercisesInThisSection from "./ExercisesInThisSection";
import Exercise from "./Exercise";
import AbStudy from "./AbStudy";
import MoodleExercise from "./MoodleExercise";
import SqlTrainerExercise from "./SqlTrainerExercise";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableTh,
} from "./Table";
import Deadline from "./Deadline";
import OnlyForAbGroup from "./AbStudy/OnlyForAbGroup";
import H3 from "./Headers/H3";
import H1 from "./Headers/H1";
import H2 from "./Headers/H2";
import H4 from "./Headers/H4";
import H5 from "./Headers/H5";
import H6 from "./Headers/H6";
import Hr from "./Hr";
import TableOfContents from "./TableOfContents";
import Notice from "./Notice";
import RegistrationLink from "./RegistrationLink";
import RegistrationLink2 from "./RegistrationLink2";
import OnlyForCourseVariant from "./OnlyForCourseVariant";
import OnlyForNotLoggedIn from "./OnlyForNotLoggedIn";
import Points from "./Points";
import GoogleFormLink from "./GoogleFormLink";
import InBrowserProgrammingExercise from "./InBrowserProgrammingExercise";
import WorkshopSchedule from "./WorkshopSchedule";
import Summary from "./Summary";
import Button from "../components/Button";
import Vocabulary from "./Vocabulary";
import VocabularyWord from "./Vocabulary/VocabularyWord";

const mapping = () => ({
  test: Test,
  "pages-in-this-section": PagesInThisSection,
  "programming-exercise": ProgrammingExercise,
  exercise: Exercise,
  "text-box": TextBox,
  "sample-data": SampleData,
  "sample-output": SampleOutput,
  "please-login": PleaseLogin,
  "float-image-right": FloatImageRight,
  "code-states-visualizer": CodeStatesVisualizer,
  "pdf-slideshow": PdfSlideshow,
  "exercises-in-this-section": ExercisesInThisSection,
  "ab-study": AbStudy,
  "only-for-ab-group": OnlyForAbGroup,
  "only-for-course-variant": OnlyForCourseVariant,
  "only-for-not-logged-in": OnlyForNotLoggedIn,
  "table-of-contents": TableOfContents,
  "registration-link": RegistrationLink,
  "registration-link-ohja": RegistrationLink2,
  "moodle-exercise": MoodleExercise,
  "sqltrainer-exercise": SqlTrainerExercise,
  "google-form-link": GoogleFormLink,
  "in-browser-programming-exercise": InBrowserProgrammingExercise,
  "workshop-schedule": WorkshopSchedule,
  "vocabulary-word": VocabularyWord,
  vocabulary: Vocabulary,
  notice: Notice,
  youtube: Youtube,
  quiz: Quiz,
  quiznator: Quiznator,
  table: Table,
  tbody: TableBody,
  thead: TableHead,
  tr: TableRow,
  td: TableCell,
  th: TableTh,
  deadline: Deadline,
  a: OutboundLink,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  hr: Hr,
  points: Points,
  summary: Summary,
  button: Button,
});

export default mapping;
