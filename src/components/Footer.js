import React, { useContext } from "react";
import styled from "styled-components";
import BackgroundImage from "../images/banner.svg";
import { Card, CardContent } from "@material-ui/core";
import { OutboundLink } from "gatsby-plugin-google-analytics";
import { Link } from "gatsby";
import { withTranslation } from "react-i18next";
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary";
import CourseSettings from "../../course-settings";

import UHLogo from "../images/uh-logo.png";
import MoocfiLogo from "../images/moocfi-logo-bw.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebook,
  faYoutube,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import Button from "./Button";
import PagesContext from "../contexes/PagesContext";

const StyledIcon = styled(FontAwesomeIcon)`
  color: black;
  margin-bottom: 1rem;
  margin: 1rem;
`;

const SocialContainer = styled.div``;

const ContentContainer = styled.div`
  padding: 1rem 0;
`;

const GithubContainer = styled.div`
  padding-top: 1rem;
  a {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ButtonContainer = styled.div`
  padding: 1rem 0;
`;

const FooterWrapper = styled.footer`
  height: 35rem;
  position: relative;
  a {
    color: #006fe6;
  }
`;

const FooterBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-image: url(${BackgroundImage});
  filter: invert(1) grayscale(1) brightness(1.5) opacity(0.5);
  z-index: -50000;
`;

const FooterContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const StyledCard = styled(Card)`
  width: 90%;
  max-width: 800px;
`;

const StyledCardContent = styled(CardContent)`
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BrandsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  img {
    height: 6rem;
    width: auto;
    margin: 1rem;
  }
`;

const Footer = ({ t }) => {
  const pagesContextValue = useContext(PagesContext);
  const filePath = pagesContextValue?.current?.filePath;

  return (
    <FooterWrapper>
      <FooterBackground />
      <FooterContent>
        <StyledCard>
          <StyledCardContent>
            <GithubContainer>
              <OutboundLink
                href={CourseSettings.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <StyledIcon icon={faGithub} size="3x" title={t("footer-src")} />
                <div>{t("footer-src")}</div>
              </OutboundLink>
            </GithubContainer>
            <ButtonContainer>
              <Button to="/report-issue">{t("footer-report-issue")}</Button>
              {filePath && (
                <Button to={`/edit-page?path=${filePath}`}>
                  {t("footer-edit-page")}
                </Button>
              )}
            </ButtonContainer>
            <ContentContainer>
              <Link to="/credits">{t("credits")}</Link>.
            </ContentContainer>
            <BrandsContainer>
              <OutboundLink
                href="https://helsinki.fi"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img alt="Helsingin yliopisto" src={UHLogo} />
              </OutboundLink>
              <OutboundLink
                href="https://mooc.fi"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img alt="MOOC.fi" src={MoocfiLogo} />
              </OutboundLink>
            </BrandsContainer>
          </StyledCardContent>
        </StyledCard>
      </FooterContent>
    </FooterWrapper>
  );
};

export default withTranslation("common")(withSimpleErrorBoundary(Footer));
