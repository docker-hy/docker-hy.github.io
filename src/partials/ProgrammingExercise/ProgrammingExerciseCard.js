import React from "react"
import styled from "styled-components"
import ContentLoader from "react-content-loader"
import { withTranslation } from "react-i18next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencilAlt as icon, faRedo } from "@fortawesome/free-solid-svg-icons"
import { Card, CardContent, Button, Typography } from "@material-ui/core"

import { normalizeExerciseId } from "../../util/strings"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"

const accentColor = "#FAAA38"

const Body = styled.div`
  padding-bottom: 0.5rem;
  min-height: 300px;
`

const Header = styled.div`
  font-size: 1.3rem;
  font-weight: normal;
  padding 1rem 0;
  border-bottom: 1px solid #f7f7f9;
  background-color: ${(props) => (props.completed ? "#13B559" : "#D23D48")};
  border-radius: 16px 16px 0px 0px;
  display: flex;
  flex-direction: row;
  align-items: 0;
  color: white;
  padding: 1rem;
  padding-bottom: 1.5rem;
  h3 {
    margin-bottom: 0;
  }
`

const HeaderMuted = styled.span`
  font-size: 18px;
  font-weight: 400;
  margin-right: 0.2rem;
  position: relative;
  bottom: -3px;
`

const HeaderTitleContainer = styled.div`
  flex: 1;
`

const Difficulty = styled.span`
  position: relative;
`

const PointContentWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const PointsLabel = styled.span`
  font-size: 18px;
  font-weight: 400;
`

const PointsText = styled(Typography)`
  font-size: 1.5rem !important;
  text-align: end;
  display: inline;
  max-height: 100%;
  color: inherit;
  @media (max-width: 550px) {
    text-align: start;
  }
`

const PointsWrapper = styled.div`
  margin-left: 0.5rem;
  display: flex;
  flex-direction: column;
  text-align: right;
  color: white;
`

const ProgrammingExerciseWrapper = styled(Card)`
  margin: 3.5rem 0;
  // border-left: 0.2rem solid ${accentColor};
  border-radius: 1rem !important;
  box-shadow: 0 8px 40px -12px rgba(0, 0, 0, 0.3) !important;
  padding: 0 !important;
  overflow: visible !important;
`

const StyledIcon = styled(FontAwesomeIcon)`
  vertical-align: middle;
  margin-right: 1.5rem;
  margin-left: 0.5rem;
  color: white;
  position: relative;
  bottom: -13px;
`

const StyledQuizPointsContentLoader = styled(ContentLoader)`
  width: 100%;
  max-width: 30px;
  height: 31.2px;
  position: relative;
  top: -4px;
`

const StyledRefreshIcon = styled(FontAwesomeIcon)`
  color: white;
`

class ProgrammingExerciseCard extends React.Component {
  render() {
    const {
      children,
      name,
      awardedPoints,
      points,
      onRefresh,
      allowRefresh,
      completed,
      difficulty,
    } = this.props

    return (
      <ProgrammingExerciseWrapper
        id={normalizeExerciseId(`programming-exercise-${name}`)}
      >
        <Header completed={completed}>
          <StyledIcon icon={icon} size="2x" />
          <HeaderTitleContainer>
            <HeaderMuted>{this.props.t("programmingExercise")} </HeaderMuted>
            <h3>{name}</h3>
            {/*Ikävän kompleksinen. Onko syytä laittaa omaan komponenttiin?*/}
            {difficulty ? (
              <Difficulty>
                {this.props.t(`difficultyHeader${difficulty}`)}
              </Difficulty>
            ) : undefined}
          </HeaderTitleContainer>
          {allowRefresh && (
            <Button onClick={onRefresh}>
              <StyledRefreshIcon icon={faRedo} />
            </Button>
          )}
          <PointsWrapper>
            <PointsLabel>{this.props.t("points")}:</PointsLabel>
            <PointContentWrapper>
              {awardedPoints !== undefined ? (
                <PointsText>{awardedPoints}</PointsText>
              ) : (
                <StyledQuizPointsContentLoader
                  animate={!points}
                  speed={2}
                  width={30}
                  height={40}
                  viewBox="0 0 30 40"
                  backgroundOpacity={0.6}
                  foregroundOpacity={0.6}
                  backgroundColor="#ffffff"
                  foregroundColor="#dddddd"
                >
                  <rect x="0" y="10" rx="12" ry="12" width="30" height="30" />
                </StyledQuizPointsContentLoader>
              )}
              <PointsText>/</PointsText>
              {points ? (
                <PointsText>{points}</PointsText>
              ) : (
                <StyledQuizPointsContentLoader
                  speed={2}
                  width={30}
                  height={40}
                  viewBox="0 0 30 40"
                  backgroundOpacity={0.6}
                  foregroundOpacity={0.6}
                  backgroundColor="#ffffff"
                  foregroundColor="#dddddd"
                >
                  <rect x="0" y="10" rx="12" ry="12" width="30" height="30" />
                </StyledQuizPointsContentLoader>
              )}
            </PointContentWrapper>
          </PointsWrapper>
        </Header>
        <CardContent>
          <Body>{children}</Body>
        </CardContent>
      </ProgrammingExerciseWrapper>
    )
  }
}

export default withTranslation("common")(
  withSimpleErrorBoundary(ProgrammingExerciseCard),
)
