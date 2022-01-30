import React from "react";
import PagesContext from "../../contexes/PagesContext";
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary";
import styled from "styled-components";
import Word from "./Word";

const WordContainer = styled.div`
  margin: 1em 2em;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-size: 1.25rem;
`;

class Vocabulary extends React.Component {
  static contextType = PagesContext;

  state = {
    render: false,
    words: null,
  };

  async componentDidMount() {
    const value = this.context;
    const words = value.all
      .map((page) => page.words)
      .flat()
      .sort((a, b) => a.name.localeCompare(b.name));

    let uniqueWords = [];
    words.forEach((word, i) => {
      if (uniqueWords.filter((w) => w.name === word.name).length > 0) {
        const index = uniqueWords.findIndex((w) => w.name === word.name);
        if (word.description != null) {
          if (uniqueWords[index].description == null) {
            uniqueWords[index].description = word.description;
          } else if (Array.isArray(uniqueWords[index].description)) {
            uniqueWords[index].description = [
              ...uniqueWords[index].description,
              word.description,
            ];
          } else {
            uniqueWords[index].description = [
              uniqueWords[index].description,
              word.description,
            ];
          }
        }
        if (Array.isArray(uniqueWords[index].parentPagePath)) {
          uniqueWords[index].parentPagePath = [
            ...uniqueWords[index].parentPagePath,
            word.parentPagePath,
          ];
        } else {
          uniqueWords[index].parentPagePath = [
            uniqueWords[index].parentPagePath,
            word.parentPagePath,
          ];
        }
      } else {
        uniqueWords.push(word);
      }
    });

    this.setState({ words: uniqueWords, render: true });
  }

  render() {
    if (!this.state.render) {
      return <div>Loading...</div>;
    }

    return (
      <WordContainer>
        {this.state.words &&
          this.state.words.map((word, i) => (
            <Word key={i} index={i} word={word} />
          ))}
      </WordContainer>
    );
  }
}

export default withSimpleErrorBoundary(Vocabulary);
