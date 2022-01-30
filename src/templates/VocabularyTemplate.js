import React, { Fragment } from "react";
import Layout from "./Layout";
import Container from "../components/Container";
import { graphql } from "gatsby";
import rehypeReact from "rehype-react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import getNamedPartials from "../partials";
import "./remark.css";
import PagesContext from "../contexes/PagesContext";
import { LoginStateContextProvider } from "../contexes/LoginStateContext";

const Title = styled.h1``;

const ContentWrapper = styled.div`
  margin-top: 1rem;
  padding-bottom: 2rem;

  p {
    margin-bottom: 2rem;
  }
`;

export default class VocabularyTemplate extends React.Component {
  static contextType = PagesContext;

  render() {
    const { data } = this.props;
    const { frontmatter, htmlAst } = data.page;
    const allPages = data.allPages.edges.map((o) => {
      const res = o.node?.frontmatter;
      res.words = o.node?.vocabularyWords;
      return res;
    });
    const partials = getNamedPartials();
    const renderAst = new rehypeReact({
      createElement: React.createElement,
      components: partials,
    }).Compiler;

    const filePath = data.page.fileAbsolutePath.substring(
      data.page.fileAbsolutePath.lastIndexOf("/data/"),
      data.page.fileAbsolutePath.length
    );

    return (
      <PagesContext.Provider
        value={{
          all: allPages,
          current: { frontmatter: frontmatter, filePath: filePath },
        }}
      >
        <Helmet title={frontmatter.title} />
        <LoginStateContextProvider>
          <Layout>
            <Fragment>
              <Container>
                <ContentWrapper>
                  <Title>{frontmatter.title}</Title>
                  {renderAst(htmlAst)}
                </ContentWrapper>
              </Container>
            </Fragment>
          </Layout>
        </LoginStateContextProvider>
      </PagesContext.Provider>
    );
  }
}

export const pageQuery = graphql`
  query ($path: String!) {
    page: markdownRemark(frontmatter: { path: { eq: $path } }) {
      htmlAst
      html
      frontmatter {
        path
        title
      }
      fileAbsolutePath
    }
    allPages: allMarkdownRemark(
      sort: { order: ASC, fields: frontmatter___path }
      limit: 1000
      filter: {
        frontmatter: { hidden: { ne: true } }
        vocabularyWords: { elemMatch: { name: { regex: "/.+/" } } }
      }
    ) {
      edges {
        node {
          id
          frontmatter {
            path
            title
          }
          vocabularyWords {
            type
            name
            description
            parentPagePath
          }
        }
      }
    }
  }
`;
