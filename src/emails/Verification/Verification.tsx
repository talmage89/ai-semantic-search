import * as React from 'react';
import { Body, Button, Container, Head, Hr, Html, Img, Preview, Section, Text } from '@react-email/components';
import './Verification.css';

type VerificationProps = {
  token: string;
};

export const Verification = (props: VerificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Preview text that appears in the email client before opening the email.</Preview>
      <Body>
        <Container>
          <Img src="my-logo.png" alt="Logo" />
          <Text>Hi there!</Text>
          <Text>Here is your verification token</Text>
          <Section>
            {/* <Button href={`${baseUrl}/auth/verify-email?token=${emailVerificationToken}`}>Click here to verify</Button> */}
          </Section>
          <Text>{props.token}</Text>
          <Hr />
          <Text>Something in the footer.</Text>
        </Container>
      </Body>
    </Html>
  );
}
