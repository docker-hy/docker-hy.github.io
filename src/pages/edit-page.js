import React from "react"
import Helmet from "react-helmet"
import Layout from "../templates/Layout"
import Container from "../components/Container"
import { OutboundLink } from "gatsby-plugin-google-analytics"
import { withLoginStateContext } from "../contexes/LoginStateContext"
import { Button, Typography } from "@material-ui/core"
import CourseSettings from "../../course-settings"
import { withTranslation } from "react-i18next"
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"

class EditPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      path: "",
      editPath: "",
      loginThenEditPath: "",
    }
  }

  componentDidMount = () => {
    var urlpath = new URLSearchParams(this.props.location.search).get("path")
    var editPath = CourseSettings.githubUrl.concat("/edit/master", urlpath)
    this.setState({
      path: new URLSearchParams(this.props.location.search).get("path"),
      editPath: editPath,
      loginThenEditPath: `https://github.com/join?return_to=${editPath}&source=login`,
    })
  }

  render() {
    if (this.state.path === "") {
      return <div>Loading...</div>
    }
    return (
      <Layout>
        <Container>
          <Helmet title={this.props.t("editPageTitle")} />

          <Typography variant="h3" component="h1">
            {this.props.t("editPageTitle")}
          </Typography>
          <br />
          <p>{this.props.t("editPage1")}</p>
          <p>
            {this.props.t("editPage2")}{" "}
            <OutboundLink
              external="true"
              href={`${this.state.loginThenEditPath}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {this.props.t("editPage3")}
            </OutboundLink>
          </p>

          <p>
            {this.props.t("editPage4")}{" "}
            <OutboundLink
              external="true"
              href={`${CourseSettings.githubUrl.concat("/pulls")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {this.props.t("editPage3")}
            </OutboundLink>{" "}
            {this.props.t("editPage5")}
          </p>

          <center>
            <OutboundLink
              external="true"
              href={`${this.state.editPath}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button color="primary" variant="contained">
                {this.props.t("editPageButtonText")}
                {this.state.path}
              </Button>
            </OutboundLink>
          </center>

          <br />
          <Typography variant="h4" component="h1">
            {this.props.t("editPageSecondHeader")}
          </Typography>
          <ol>
            <li>{this.props.t("editPageList1")}</li>
            <li>{this.props.t("editPageList2")}</li>
            <li>{this.props.t("editPageList3")}</li>
            <li>{this.props.t("editPageList4")}</li>
            <li>{this.props.t("editPageList5")}</li>
            <li>{this.props.t("editPageList6")}</li>
          </ol>

          <p>{this.props.t("editPage6")}</p>
        </Container>
      </Layout>
    )
  }
}

export default withTranslation("common")(
  withSimpleErrorBoundary(withLoginStateContext(EditPage)),
)
