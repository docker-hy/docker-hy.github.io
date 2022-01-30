import React from "react";
import styled from "styled-components";
import { OutboundLink } from "gatsby-plugin-google-analytics";
import { get } from "lodash";

import { withTranslation } from "react-i18next";
import {
  fetchProgrammingExerciseDetails,
  fetchProgrammingExerciseModelSolution,
} from "../../services/moocfi";
import LoginStateContext from "../../contexes/LoginStateContext";
import LoginControls from "../../components/LoginControls";
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary";
import ExerciseDescription from "./ExerciseDescription";
import StyledDivider from "../../components/StyledDivider";
import ProgrammingExerciseCard from "./ProgrammingExerciseCard";
import Alert from "@material-ui/lab/Alert";
import CourseSettings from "../../../course-settings";

const LoginNag = styled.div`
  margin-bottom: 1rem;
`;

const LoginNagWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
`;

const Small = styled.div`
  p {
    font-size: 0.9rem;
    color: #333;
  }
`;
const StyledAlert = styled(Alert)`
  margin-bottom: 1rem;
`;

class ProgrammingExercise extends React.Component {
  static contextType = LoginStateContext;

  // {
  //   "id": 55219,
  //   "available_points": [
  //     {
  //       "id": 619839,
  //       "exercise_id": 55219,
  //       "name": "01-01",
  //       "requires_review": false
  //     }
  //   ],
  //   "name": "osa01-Osa01_01.Hiekkalaatikko",
  //   "publish_time": null,
  //   "deadline": null,
  //   "soft_deadline": null,
  //   "expired": false,
  //   "disabled": false,
  //   "completed": false
  // }
  state = {
    exerciseDetails: undefined,
    modelSolutionModalOpen: false,
    modelSolution: undefined,
    render: false,
  };

  async componentDidMount() {
    this.setState({ render: true });
    await this.fetch();
  }

  fetch = async () => {
    if (!this.props.tmcname) {
      return;
    }
    let exerciseDetails = null;
    try {
      exerciseDetails = await fetchProgrammingExerciseDetails(
        this.props.tmcname
      );
    } catch (error) {
      console.error(error);
    }
    this.setState({
      exerciseDetails,
    });
  };

  onShowModelSolution = async () => {
    try {
      let modelSolution = this.state.modelSolution;
      if (!modelSolution) {
        modelSolution = await fetchProgrammingExerciseModelSolution(
          this.state.exerciseDetails.id
        );
      }

      this.setState({ modelSolutionModalOpen: true, modelSolution });
    } catch (err) {
      console.error("Could not fetch model solution", err);
    }
  };

  onModelSolutionModalClose = () => {
    this.setState({ modelSolutionModalOpen: false });
  };

  onUpdate = async () => {
    this.setState({
      exerciseDetails: undefined,
      modelSolutionModalOpen: false,
      modelSolution: undefined,
    });
    await this.fetch();
  };

  render() {
    const { children, name, difficulty } = this.props;

    if (!this.state.render) {
      return <div>Loading</div>;
    }

    const completed = get(this.state, "exerciseDetails.completed");
    const points = get(this.state, "exerciseDetails.available_points.length");
    const awardedPoints = get(
      this.state,
      "exerciseDetails.awarded_points.length"
    );

    return (
      <ProgrammingExerciseCard
        name={name}
        points={points}
        awardedPoints={awardedPoints}
        onRefresh={this.onUpdate}
        allowRefresh={this.context.loggedIn}
        completed={completed}
        difficulty={difficulty}
      >
        <div>
          {CourseSettings.showExerciseDescriptionWhenNotLoggedIn ? (
            <div>
              {!this.context.loggedIn && (
                <StyledAlert severity="warning">
                  {this.props.t("loginToSeeExercisePoints")}
                </StyledAlert>
              )}
              {points && points > 1 && (
                <Small>
                  <p>
                    {this.props.t("submitNB")}{" "}
                    <OutboundLink
                      href="https://www.mooc.fi/fi/installation/netbeans"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {this.props.t("submitHowTo")}
                    </OutboundLink>
                    .
                  </p>
                  <StyledDivider />
                </Small>
              )}
              <ExerciseDescription>{children}</ExerciseDescription>
            </div>
          ) : (
            <div>
              {this.context.loggedIn ? (
                <div>
                  {points && points > 1 && (
                    <Small>
                      <p>
                        {this.props.t("submitNB")}{" "}
                        <OutboundLink
                          href="https://www.mooc.fi/fi/installation/netbeans"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {this.props.t("submitHowTo")}
                        </OutboundLink>
                        .
                      </p>
                      <StyledDivider />
                    </Small>
                  )}
                  <ExerciseDescription>{children}</ExerciseDescription>
                  {this.state.exerciseDetails === null && (
                    <div>Error loading exercise details</div>
                  )}
                </div>
              ) : (
                <div>
                  <LoginNag>{this.props.t("loginForExercise")}</LoginNag>
                  <LoginNagWrapper>
                    <LoginControls />
                  </LoginNagWrapper>
                </div>
              )}
            </div>
          )}
        </div>
      </ProgrammingExerciseCard>
    );
  }
}

export default withTranslation("common")(
  withSimpleErrorBoundary(ProgrammingExercise)
);
