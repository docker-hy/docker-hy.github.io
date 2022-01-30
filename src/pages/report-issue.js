import React from "react";
import Helmet from "react-helmet";
import Layout from "../templates/Layout";
import Container from "../components/Container";
import { OutboundLink } from "gatsby-plugin-google-analytics";
import { withLoginStateContext } from "../contexes/LoginStateContext";
import { Button, Typography } from "@material-ui/core";
import CourseSettings from "../../course-settings";
import { withTranslation } from "react-i18next";
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary";

const ReportIssue = ({ t }) => (
  <Layout>
    <Container>
      <Helmet title={t("reportIssueTitle")} />

      <Typography variant="h3" component="h1">
        {t("reportIssueTitle")}
      </Typography>
      <br />
      <p>{t("reportIssue1")}</p>
      <p>
        {t("reportIssue2")}{" "}
        <OutboundLink
          href={"https://github.com/join?return_to=".concat(
            CourseSettings.githubUrl,
            "/issues/new&source=login"
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("reportIssue3")}
        </OutboundLink>
      </p>

      <p>
        {t("reportIssue4")}{" "}
        <OutboundLink
          href={CourseSettings.githubUrl.concat("/issues")}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("reportIssue3")}
        </OutboundLink>{" "}
        {t("reportIssue5")}
      </p>

      <center>
        <OutboundLink
          href={CourseSettings.githubUrl.concat("/issues/new")}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button color="primary" variant="contained">
            {t("reportIssueButtonText")}
          </Button>
        </OutboundLink>
      </center>

      <br />
      <Typography variant="h4" component="h1">
        {t("reportIssueSecondHeader")}
      </Typography>
      <ol>
        <li>{t("reportIssueList1")}</li>
        <li>{t("reportIssueList2")}</li>
        <li>{t("reportIssueList3")}</li>
        <li>{t("reportIssueList4")}</li>
      </ol>

      <p>{t("reportIssue6")}</p>

      <p>{t("reportIssue7")}</p>
    </Container>
  </Layout>
);

export default withTranslation("common")(
  withSimpleErrorBoundary(withLoginStateContext(ReportIssue))
);
