import React from "react"
import PagesContext from "../../contexes/PagesContext"
import styled from "styled-components"
import { Paper } from "@material-ui/core"
import { Link } from "gatsby"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"
import ExerciseSummary from "../ExercisesInThisSection/ExerciseSummary"
import { fetchQuizNames } from "../../services/quizzes"
import {
  extractPartNumberFromPath,
  extractSubpartNumberFromPath,
} from "../../util/strings"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLink } from "@fortawesome/free-solid-svg-icons"

const PartWrapper = styled(Paper)`
  padding: 1rem;
  margin: 2rem 0;
`

const Page = styled.div`
  margin: 1rem 0;
`

const Title = styled.div`
  margin-bottom: 0.35em;
  color: rgba(0, 0, 0, 0.87);
  font-size: 1.5em;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 800;
  line-height: 1.33;
  letter-spacing: 0em;

  a {
    margin-left: 0.5em;
  }
`

const Subtitle = styled.div`
  margin-bottom: 0.5em;
  color: rgba(0, 0, 0, 0.87);
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 400;
  font-size: 1.1rem;
  letter-spacing: 0em;

  a {
    margin-left: 0.5em;
  }
`

class ExerciseList extends React.Component {
  static contextType = PagesContext

  state = {
    render: false,
    sectionPages: null,
    quizIdToTitle: null,
  }

  async componentDidMount() {
    const value = this.context

    const overviewPages = value.all
      .filter((o) => o.overview && !o.hidden)
      .sort((a, b) => {
        let partA = extractPartNumberFromPath(a.path.toLowerCase())
        let partB = extractPartNumberFromPath(b.path.toLowerCase())

        return partA > partB ? 1 : partB > partA ? -1 : 0
      })

    const exercisePages = value.all.filter((o) => o.exercises?.length > 0)

    const quizIdToTitle = await fetchQuizNames()
    this.setState({ overviewPages, exercisePages, quizIdToTitle, render: true })
  }
  render() {
    if (!this.state.render) {
      return <div>Loading...</div>
    }
    return (
      <div>
        {this.state.overviewPages &&
          this.state.overviewPages.map((page) => (
            <PartWrapper key={page.title}>
              <Title>
                {page.title}
                <Link to={page.path}>
                  <FontAwesomeIcon icon={faLink} size="xs" />
                </Link>
              </Title>

              {this.state.exercisePages
                .filter((o) => o.path.startsWith(`${page.path}/`))
                .sort((a, b) => {
                  let subA = extractSubpartNumberFromPath(a.path.toLowerCase())
                  let subB = extractSubpartNumberFromPath(b.path.toLowerCase())

                  return subA > subB ? 1 : subB > subA ? -1 : 0
                })
                .map((page) => (
                  <Page key={page.title}>
                    <Subtitle>
                      {page.title}
                      <Link to={page.path}>
                        <FontAwesomeIcon icon={faLink} size="sm" />
                      </Link>
                    </Subtitle>
                    {page.exercises.map((exercise, i) => (
                      <ExerciseSummary
                        index={i}
                        exercise={exercise}
                        key={exercise.id}
                        quizIdToTitle={this.state.quizIdToTitle}
                      />
                    ))}
                  </Page>
                ))}
            </PartWrapper>
          ))}
      </div>
    )
  }
}

export default withSimpleErrorBoundary(ExerciseList)
