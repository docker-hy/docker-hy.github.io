import React from "react";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@material-ui/core";

import { OutboundLink } from "gatsby-plugin-google-analytics";

import {
  courseVariants,
  updateUserDetails,
  userDetails,
} from "../../services/moocfi";
import Loading from "../Loading";

import styled from "styled-components";
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary";
import { withTranslation } from "react-i18next";

const Row = styled.div`
  margin-bottom: 1.5rem;
`;

const Form = styled.form``;

const InfoBox = styled.div`
  margin-bottom: 2rem;
`;

const FormContainer = styled.div`
  height: 100%;
  margin-top: 2rem;
`;

const WarningBox = styled(Card)`
  margin: 2rem 0;
  background: #f1a9a0;
  padding: 1rem;
  font-weight: bold;
`;

class CourseOptionsEditor extends React.Component {
  async componentDidMount() {
    const data = await userDetails();
    const variants = await courseVariants();

    let useCourseVariant = data.extra_fields?.use_course_variant === "t";
    let courseVariant = data.extra_fields?.course_variant ?? "";
    if (!variants.find((x) => x.key === courseVariant)) {
      useCourseVariant = false;
      courseVariant = "";
    }

    this.setState(
      {
        first_name: data.user_field?.first_name,
        last_name: data.user_field?.last_name,
        email: data.email,
        student_number: data.user_field?.organizational_id,
        digital_education_for_all:
          data.extra_fields?.digital_education_for_all === "t",
        use_course_variant: useCourseVariant,
        course_variant: courseVariant,
        course_variants: variants,
        marketing: data.extra_fields?.marketing === "t",
        research: data.extra_fields?.research,
        loading: false,
      },
      () => {
        this.validate();
      }
    );
  }

  onClick = async (e) => {
    e.preventDefault();
    this.setState({ submitting: true });
    let extraFields = {
      digital_education_for_all: this.state.digital_education_for_all,
      use_course_variant: this.state.use_course_variant,
      course_variant: this.state.course_variant,
      marketing: this.state.marketing,
      research: this.state.research,
    };
    const userField = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      organizational_id: this.state.student_number,
    };
    try {
      await updateUserDetails({
        extraFields,
        userField,
      });
      this.setState({ submitting: false });
      this.props.onComplete();
    } catch (err) {
      this.setState({ errorObj: err, submitting: false });
    }
  };

  state = {
    submitting: false,
    error: true,
    errorObj: undefined,
    digital_education_for_all: false,
    marketing: false,
    research: undefined,
    first_name: undefined,
    last_name: undefined,
    use_course_variant: undefined,
    course_variant: "",
    course_variants: [],
    email: undefined,
    student_number: undefined,
    loading: true,
    focused: null,
  };

  handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value }, () => {
      this.validate();
    });
  };

  handleCheckboxInput = (e) => {
    const name = e.target.name;
    const value = e.target.checked;
    this.setState({ [name]: value }, () => {
      this.validate();
    });
  };

  handleCourseVariantCheckbox = (e) => {
    this.setState(
      {
        use_course_variant: e.target.checked,
        course_variant: "",
      },
      () => {
        this.validate();
      }
    );
  };

  handleFocus = (e) => {
    const name = e.target.name;
    this.setState({ focused: name });
  };

  handleUnFocus = () => {
    this.setState({ focused: null });
  };

  validate = () => {
    this.setState((prev) => {
      const researchNotAnswered = prev.research === undefined;
      const missingVariant = prev.use_course_variant && !prev.course_variant;

      return { error: researchNotAnswered || missingVariant };
    });
  };

  render() {
    return (
      <FormContainer>
        <Loading loading={this.state.loading} heightHint="490px">
          <InfoBox>
            <Card>
              <CardContent>
                {this.props.t("loggedInWith")}
                {this.state.email}
              </CardContent>
            </Card>
          </InfoBox>
        </Loading>
        <h1>{this.props.t("studentInfo")}</h1>
        <Form>
          <InfoBox>{this.props.t("aboutYourself")}</InfoBox>
          <Loading loading={this.state.loading} heightHint="490px">
            <div>
              <Row>
                <TextField
                  variant="outlined"
                  type="text"
                  label={this.props.t("firstName")}
                  autoComplete="given-name"
                  name="first_name"
                  InputLabelProps={{
                    shrink:
                      this.state.first_name ||
                      this.state.focused === "first_name",
                  }}
                  fullWidth
                  value={this.state.first_name}
                  onChange={this.handleInput}
                  onFocus={this.handleFocus}
                  onBlur={this.handleUnFocus}
                />
              </Row>

              <Row>
                <TextField
                  variant="outlined"
                  type="text"
                  label={this.props.t("lastName")}
                  autoComplete="family-name"
                  name="last_name"
                  InputLabelProps={{
                    shrink:
                      this.state.last_name ||
                      this.state.focused === "last_name",
                  }}
                  fullWidth
                  value={this.state.last_name}
                  onChange={this.handleInput}
                  onFocus={this.handleFocus}
                  onBlur={this.handleUnFocus}
                />
              </Row>

              <Row>
                <TextField
                  variant="outlined"
                  type="text"
                  label={this.props.t("sid")}
                  name="student_number"
                  InputLabelProps={{
                    shrink:
                      this.state.student_number ||
                      this.state.focused === "student_number",
                  }}
                  fullWidth
                  value={this.state.student_number}
                  onChange={this.handleInput}
                  helperText={this.props.t("nosid")}
                  onFocus={this.handleFocus}
                  onBlur={this.handleUnFocus}
                />
              </Row>

              <Row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.digital_education_for_all}
                      onChange={this.handleCheckboxInput}
                      name="digital_education_for_all"
                      value="1"
                    />
                  }
                  label="Olen tällä hetkellä opiskelijana Digital Education for All -hankkeessa. Jätä tämä valitsematta mikäli et tiedä kyseisestä hankkeesta."
                />
              </Row>

              <Row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.marketing}
                      onChange={this.handleCheckboxInput}
                      name="marketing"
                      value="1"
                    />
                  }
                  label={this.props.t("marketing")}
                />
              </Row>

              {this.state.course_variants.length === 0 ? null : (
                <div>
                  <h2>{this.props.t("courseInfo")}</h2>
                  <Row>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.use_course_variant}
                          onChange={this.handleCourseVariantCheckbox}
                          name="use_course_variant"
                          value="1"
                        />
                      }
                      disabled={this.state.course_variants.length === 0}
                      label={this.props.t("useCourseVariantLabel")}
                    />
                  </Row>

                  <Row>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel
                        id="select-course"
                        shrink={
                          this.state.course_variant ||
                          this.state.focused === "course_variant"
                        }
                      >
                        {this.props.t("courseVariant")}
                      </InputLabel>
                      <Select
                        key={this.state.use_course_variant}
                        disabled={!this.state.use_course_variant}
                        labelId="select-course"
                        label={this.props.t("courseVariant")}
                        name="course_variant"
                        value={this.state.course_variant}
                        onChange={this.handleInput}
                        onFocus={this.handleFocus}
                        onBlur={this.handleUnFocus}
                      >
                        <MenuItem value="" disabled>
                          {this.props.t("chooseCourse")}
                        </MenuItem>
                        {this.state.course_variants.map((x) => {
                          const key = `${x.tmcOrganization}-${x.tmcCourse}`;
                          return (
                            <MenuItem value={key} key={key}>
                              {x.organizationName}: {x.title}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Row>
                </div>
              )}
            </div>
          </Loading>

          <h2>{this.props.t("researchTitle")}</h2>

          <p>{this.props.t("research1")}</p>

          <ol>
            <li>{this.props.t("research2")}</li>
            <li>{this.props.t("research3")}</li>
            <li>{this.props.t("research4")}</li>
          </ol>

          <p>
            {this.props.t("research5")}
            <OutboundLink
              href="https://dl.acm.org/citation.cfm?id=2858798"
              target="_blank"
              rel="noopener noreferrer"
            >
              Educational Data Mining and Learning Analytics in Programming:
              Literature Review and Case Studies
            </OutboundLink>
            .
          </p>

          <p>{this.props.t("research6")}</p>

          <p>{this.props.t("research7")}</p>

          <Row>
            <Loading loading={this.state.loading} heightHint="115px">
              <RadioGroup
                aria-label={this.props.t("researchAgree")}
                name="research"
                value={this.state.research}
                onChange={this.handleInput}
              >
                <FormControlLabel
                  value="1"
                  control={<Radio color="primary" />}
                  label={this.props.t("researchYes")}
                />
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label={this.props.t("researchNo")}
                />
              </RadioGroup>
            </Loading>
          </Row>

          <Row>
            <Button
              onClick={this.onClick}
              disabled={this.state.submitting || this.state.error}
              loading={this.state.submitting}
              variant="contained"
              color="primary"
              fullWidth
            >
              {this.props.t("save")}
            </Button>
          </Row>
        </Form>
        {this.state.error && (
          <InfoBox>
            <b>{this.props.t("fillRequired")}</b>
          </InfoBox>
        )}
        {this.state.errorObj && (
          <WarningBox>{this.state.errorObj.toString()}</WarningBox>
        )}
      </FormContainer>
    );
  }
}

export default withTranslation("common")(
  withSimpleErrorBoundary(CourseOptionsEditor)
);
