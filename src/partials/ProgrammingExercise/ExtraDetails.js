import React from "react";
import Loading from "../../components/Loading";
import { OutboundLink } from "gatsby-plugin-google-analytics";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from "@material-ui/core";
import Coins from "./Coins";
import { withTranslation } from "react-i18next";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import styled from "styled-components";

const StyledTypography = styled(Typography)`
  margin-bottom: 0.5rem !important;
`;

const ExtraDetails = ({ exerciseDetails, onUpdate, nocoins, t }) => {
  if (!exerciseDetails) {
    return <Loading heightHint="305px" />;
  }
  return (
    <div>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{t("submitHowTo")}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div>
            <StyledTypography>
              {t("submitNetBeans")}{" "}
              <OutboundLink
                href={t("installationGuideLink")}
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("submitHowTo")}
              </OutboundLink>
              .
            </StyledTypography>
            <StyledTypography>
              {t("seeSubmissions")}{" "}
              <OutboundLink
                href={`https://tmc.mooc.fi/exercises/${exerciseDetails.id}?use_clients=1`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {t("here")}
              </OutboundLink>
              .
            </StyledTypography>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          {exerciseDetails?.course
            ?.grant_model_solution_token_every_nth_completed_exercise ? (
            <Typography>{t("coinSolutionHowTo")}</Typography>
          ) : (
            <Typography>{t("solutionHowTo")}</Typography>
          )}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Coins
            exerciseDetails={exerciseDetails}
            onUpdate={onUpdate}
            nocoins={nocoins}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default withTranslation("common")(ExtraDetails);
