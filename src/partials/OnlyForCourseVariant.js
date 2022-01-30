import React, { Component } from "react";
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary";
import { getCourseVariant } from "../services/moocfi";
import LoginStateContext from "../contexes/LoginStateContext";

class OnlyForCourseVariant extends Component {
  static contextType = LoginStateContext;
  state = {
    render: false,
    organization: "",
    course: "",
  };

  async componentDidMount() {
    this.setState({
      render: true,
    });

    const { tmcOrganization, tmcCourse } = await getCourseVariant();
    this.setState({ organization: tmcOrganization, course: tmcCourse });
  }

  render() {
    if (!this.state.render && !this.state.organization && !this.state.course) {
      return <div>Loading...</div>;
    }
    if (!this.context.loggedIn) {
      return <div />;
    }
    if (
      this.props.organization === this.state.organization &&
      this.props.course === this.state.course
    ) {
      return this.props.children;
    }
    return <div />;
  }
}

export default withSimpleErrorBoundary(OnlyForCourseVariant);
