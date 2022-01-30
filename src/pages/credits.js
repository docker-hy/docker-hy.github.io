import React from "react";
import Helmet from "react-helmet";
import Layout from "../templates/Layout";
import Container from "../components/Container";
import { OutboundLink } from "gatsby-plugin-google-analytics";
import { withLoginStateContext } from "../contexes/LoginStateContext";

const Credits = () => (
  <Layout>
    <Container>
      <Helmet title="Credits" />
      <h1>Credits</h1>
      <p>
        Course material has been done by{" "}
        <a href="https://github.com/jakousa">Jami Kousa</a> with the help of
        University of Helsinki's Tietojenkäsittelytieteen osaston
        sovelluskehitysakatemia (Toska) and{" "}
        <a href="https://github.com/docker-hy/docker-hy.github.io/graphs/contributors">
          numerous course attendees
        </a>
        . This material is based on{" "}
        <a href="https://gist.github.com/matti/0b44eb865d70d98ffe0351fd8e6fa35d">
          gist
        </a>{" "}
        by <a href="https://github.com/matti">Matti Paksula</a>. You can help{" "}
        <a href="/contributing">develop</a> the course material as well.
      </p>
      <p>
        This material is following the official Docker guidelines presented on
        the{" "}
        <a href="https://www.docker.com/legal/trademark-guidelines">
          official website
        </a>
        . If you find anything conflicting or otherwise prohibited use, please
        inform us and we'll make the required changes.
      </p>
      <p>
        This material is licenced under{" "}
        <a
          rel="license"
          href="http://creativecommons.org/licenses/by-nc-sa/3.0/"
        >
          Creative Commons BY-NC-SA 3.0 -licence
        </a>
        , so you can freely use and distribute the material, as long as original
        creators are credited. If you make changes to material and you want to
        distribute altered version it must be licenced under the same licence.
        Usage of material for commercial use is prohibited without permission.
      </p>

      <h2>Kurssilla käytössä oleva teknologia</h2>

      <p>
        Kurssisivuston ovat tehneet{" "}
        <OutboundLink
          href="https://github.com/nygrenh"
          target="_blank"
          rel="noopener noreferrer"
        >
          Henrik Nygren
        </OutboundLink>{" "}
        ja{" "}
        <OutboundLink
          href="https://github.com/redande"
          target="_blank"
          rel="noopener noreferrer"
        >
          Antti Leinonen
        </OutboundLink>
        . Helsingin yliopiston{" "}
        <OutboundLink
          href="https://www.helsinki.fi/en/researchgroups/data-driven-education"
          target="_blank"
          rel="noopener noreferrer"
        >
          Agile Education Research -tutkimusryhmä
        </OutboundLink>{" "}
        on luonut kurssilla käytetyn ohjelmointitehtävien palautusympäristön (
        <OutboundLink
          href="https://tmc.mooc.fi"
          target="_blank"
          rel="noopener noreferrer"
        >
          Test My Code
        </OutboundLink>
        ) ja sen liitännäiset ohjelmointiympäristöihin, kurssimateriaalissa
        olevan kyselyjärjestelmän ja muut toiminnot.
      </p>
    </Container>
  </Layout>
);

export default withLoginStateContext(Credits);
