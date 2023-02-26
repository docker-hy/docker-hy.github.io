import React from "react"
import styled from "styled-components"
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"
import { withTranslation } from "react-i18next"

const Wrapper = styled.aside`
  border-left: 0.2rem solid var(--color);
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
`

const Header = styled.h3`
  font-size: 1.3rem;
  font-weight: normal;
  padding: 0.5rem;
  margin: 0.5rem 1rem;
`

const Body = styled.div`
  margin: 0.5rem 1rem;
`

const Split = styled.div`
  border-bottom: 1px solid #bdc3c7;
`

const Summary = (props) => {
  const updatedPropsChildren = props.children.map((child, index) => {
    return child.type.displayName === "Hr__StyledDivider" ? (
      <Split />
    ) : (
      <Body>{child}</Body>
    )
  })
  return (
    <Wrapper>
      <Header>Tässä osiossa käsiteltiin seuraavat asiat:</Header>
      <Split />
      {updatedPropsChildren}
    </Wrapper>
  )
}

export default withTranslation("common")(withSimpleErrorBoundary(Summary))
