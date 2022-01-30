import React from "react";
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary";

const VocabularyWord = ({ name, description }) => {
  const anchor = name.toLowerCase().replace(" ", "-");
  console.log(anchor);
  return <div id={anchor}></div>;
};

export default withSimpleErrorBoundary(VocabularyWord);
