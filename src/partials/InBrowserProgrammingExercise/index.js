import React, { Fragment, lazy, Suspense } from "react";
import { Paper } from "@material-ui/core";
import styled from "styled-components";
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary";
import Loading from "../../components/Loading";
const MoocFiPythonEditor = lazy(() => import("./MoocfiPythonEditorLoader"));

const StyledPaper = styled(Paper)`
  @media only screen and (max-width: 800px) {
    overflow-y: scroll;
  }
`;

class MoocFiPythonEditorWrapper extends React.Component {
  state = {
    render: false,
  };

  constructor(props) {
    super(props);
    this.linkContainer = React.createRef();
  }

  componentDidMount() {
    this.setState({ render: true });
  }

  render() {
    if (!this.state.render) {
      return (
        <Fragment>
          <Loading loading={true} heightHint="540px" />
        </Fragment>
      );
    }
    return (
      <Suspense fallback={<div style={{ height: "540px" }}>Loading...</div>}>
        <StyledPaper>
          <MoocFiPythonEditor {...this.props} />
        </StyledPaper>
      </Suspense>
    );
  }
}

export default withSimpleErrorBoundary(MoocFiPythonEditorWrapper);
