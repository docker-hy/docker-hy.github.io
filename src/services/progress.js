import { fetchProgrammingProgress } from "./moocfi";
import { zip } from "../util/arrays";
import { fetchQuizzesProgress } from "./quizzes";

//eslint-disable-next-line no-unused-vars
const introductionCourseGroups = [
  "osa01",
  "osa02",
  "osa03",
  "osa04",
  "osa05",
  "osa06",
  "osa07",
];

export async function fetchProgress(t) {
  // await fetchQuizzesProgress()
  const serviceIdentifiers = [t("programmingService"), t("quizService")];
  const progressesCollection = await Promise.all([
    fetchProgrammingProgress(),
    fetchQuizzesProgress(),
  ]);
  // const userDetails = await getCachedUserDetails()
  // const currentCourseVariant = userDetails?.extra_fields?.course_variant
  const progressByGroup = {};

  zip(serviceIdentifiers, progressesCollection).forEach(
    ([identifier, progresses]) => {
      console.log(JSON.stringify(progresses));
      progresses.forEach((progressEntry) => {
        if (!progressByGroup[progressEntry.group]) {
          progressByGroup[progressEntry.group] = {};
        }
        progressByGroup[progressEntry.group][identifier] = progressEntry;
      });
    }
  );
  const toBeDeleted = [];
  Object.entries(progressByGroup).forEach(([group, serviceEntries]) => {
    if (
      !Object.keys(serviceEntries).find((o) => o === t("programmingService"))
    ) {
      toBeDeleted.push(group);
    }
  });
  // TODO: this is not a good way to do this
  toBeDeleted.forEach((o) => {
    delete progressByGroup[o];
  });
  return progressByGroup;
}
