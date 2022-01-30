import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown as icon } from "@fortawesome/free-solid-svg-icons";
import { withTranslation } from "react-i18next";
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary";
import ExerciseList from "./ExerciseList";

class ExercisesInThisSection extends React.Component {
  state = {
    render: false,
  };

  componentDidMount() {
    this.setState({ render: true });
  }

  render() {
    if (!this.state.render) {
      return <div>Loading...</div>;
    }
    return (
      <Accordion>
        <AccordionSummary expandIcon={<FontAwesomeIcon icon={icon} />}>
          {this.props.t("exerciseList")}
        </AccordionSummary>
        <AccordionDetails>
          <ExerciseList />
        </AccordionDetails>
      </Accordion>
    );
  }
}

export default withTranslation("common")(
  withSimpleErrorBoundary(ExercisesInThisSection)
);
