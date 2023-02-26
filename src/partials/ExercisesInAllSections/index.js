import React from "react"
import { withTranslation } from "react-i18next"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"
import ExerciseList from "./ExerciseList"

class ExercisesInAllSections extends React.Component {
  state = {
    render: false,
  }

  componentDidMount() {
    this.setState({ render: true })
  }

  render() {
    if (!this.state.render) {
      return <div>Loading...</div>
    }
    return <ExerciseList />
  }
}

export default withTranslation("common")(
  withSimpleErrorBoundary(ExercisesInAllSections),
)
