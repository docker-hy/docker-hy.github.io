import React from "react";
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary";
import { withTranslation } from "react-i18next";
import { AnchorLink } from "gatsby-plugin-anchor-links";
import styled from "styled-components";

const StyledWord = styled.div`
  margin-bottom: 0.5em;
`;

const StyledLink = styled(AnchorLink)`
  margin-left: 0.5em;
`;

const transformParentPagePath = (parentPagePath) => {
  const sectionNumber = parentPagePath.split("-")[1].replace("/", ".");
  return sectionNumber;
};

const transformNameToAnchor = (name) => {
  return name.toLowerCase().replace(" ", "-");
};

const Word = ({ word }) => {
  return (
    <StyledWord>
      <b>{word.name}</b>,
      {Array.isArray(word.parentPagePath) ? (
        word.parentPagePath.map((path, i) => (
          <StyledLink
            key={i}
            to={`${path}#${transformNameToAnchor(word.name)}`}
          >
            {transformParentPagePath(path)}
          </StyledLink>
        ))
      ) : (
        <StyledLink
          to={`${word.parentPagePath}#${transformNameToAnchor(word.name)}`}
        >
          {transformParentPagePath(word.parentPagePath)}
        </StyledLink>
      )}
      {word.description &&
        (Array.isArray(word.description) ? (
          word.description.map((d, i) => <div key={i}>- {d}</div>)
        ) : (
          <div>- {word.description}</div>
        ))}
    </StyledWord>
  );
};

export default withTranslation("common")(withSimpleErrorBoundary(Word));
