import { Button } from "@react-email/button";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Img } from "@react-email/img";
import { Link } from "@react-email/link";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";
import * as React from "react";

export default function Email(props: {
  name: string;
  username: string;
  email: string;
  url: string;
}) {
  const { name, email, url, username } = props;
  return (
    <Html>
      <Head />
      <Preview>Join TimeSync!</Preview>
      <Section style={main}>
        <Container style={container}>
          <Section style={{ marginTop: "32px" }}>
            <Img
              src={`https://disadus.app/logo.png`}
              width="48"
              height="48"
              alt="Vercel"
              style={logo}
            />
          </Section>
          <Text style={h1}>

          </Text>
          <Text style={text}>
            Hello <strong>{name}</strong>,
          </Text>
          <Text style={text}>
            You are just one step away from joining TimeSync! We just need you to
            <strong> Click the button below to join.</strong>
          </Text>
          <Section style={{ textAlign: "center" }}>
            <Button /*pX={20} pY={12} */ style={btn} href={url}>
              Start Syncing
            </Button>
          </Section>
          <Text style={text}>
            <br />
            or copy and paste this URL into your browser:{" "}
            <Link href={url} target="_blank" style={link} rel="noreferrer">
              {url}
            </Link>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            This invitation was intended for{" "}
            <span style={black}>{username}</span> ({email}). If you were not
            expecting this invitation, you can ignore this email. If you are
            concerned about your account's safety, please reply to this email to
            get in touch with us.
          </Text>
        </Container>
      </Section>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
};

const container = {
  border: "1px solid #eaeaea",
  borderRadius: "5px",
  margin: "40px auto",
  padding: "20px",
  width: "465px",
};

const logo = {
  margin: "0 auto",
};

const h1 = {
  color: "#000",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "normal",
  textAlign: "center" as const,
  margin: "30px 0",
  padding: "0",
};

const avatar = {
  borderRadius: "100%",
};

const link = {
  color: "#067df7",
  textDecoration: "none",
};

const text = {
  color: "#000",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  lineHeight: "24px",
};

const black = {
  color: "black",
};

const center = {
  verticalAlign: "middle",
};

const btn = {
  backgroundColor: "#000",
  borderRadius: "5px",
  color: "#fff",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  fontWeight: 500,
  lineHeight: "50px",
  textDecoration: "none",
  textAlign: "center" as const,
  padding: "12px 20px 12px 20px"
} as React.CSSProperties;

const spacing = {
  marginBottom: "26px",
};

const hr = {
  border: "none",
  borderTop: "1px solid #eaeaea",
  margin: "26px 0",
  width: "100%",
};

const footer = {
  color: "#666666",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "24px",
};
