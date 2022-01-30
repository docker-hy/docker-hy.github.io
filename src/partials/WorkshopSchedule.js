import React from "react";
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary";
import CourseSettings from "../../course-settings";

const WorkShopSchedule = ({ slug }) => {
  const language = CourseSettings.language;
  return (
    <iframe
      title="WorkShop Schedule"
      src={`https://study.cs.helsinki.fi/pajat/api/v2/${slug}/current?name=false&lang=${language}`}
      width="100%"
      height="528"
      frameBorder="0"
    >
      Your browser does not support iframes.
    </iframe>
  );
};

export default withSimpleErrorBoundary(WorkShopSchedule);
