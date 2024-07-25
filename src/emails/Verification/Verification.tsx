import * as React from 'react';
import { Body, Button, Container, Head, Hr, Html, Img, Preview, Section, Text } from '@react-email/components';

type VerificationProps = {
  token: string;
};

export const Verification = (props: VerificationProps) => {
  const getUrl = () => `${process.env.URL}/auth/verify-email?token=${props.token}`;

  return (
    <Html>
      <Head />
      <Preview>Preview text that appears in the email client before opening the email.</Preview>
      <Body style={styles.body}>
        <Container>
          <Text style={{ ...styles.generalP, ...styles.h2 }}>Semantic Search</Text>
          <Text style={styles.generalP}>Hi there!</Text>
          <Text style={styles.generalP}>
            Please verify your email address by clicking the link below. Alternatively, you can copy/paste the URL into
            your preferred web browser.
          </Text>
          <Section style={{ ...styles.centeredSection, ...styles.marginTop }}>
            <Button style={styles.button} href={getUrl()}>
              Verify my email
            </Button>
          </Section>
          <Section style={{ ...styles.centeredSection, ...styles.marginBottom }}>
            <Text style={styles.centeredP}>{getUrl()}</Text>
          </Section>
          <Hr />
          <Text style={styles.footerP}>
            You received this email because you signed up for an account at {process.env.URL}. If you don't recognize
            this activity, report it by responding to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    fontFamily: "'Mulish', sans-serif",
    fontStyle: 'normal',
  },
  h2: {
    fontSize: '32px',
    fontWeight: '600',
    marginTop: '2rem',
    marginBottom: '2rem',
  },
  generalP: {
    fontSize: '16px',
  },
  centeredSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marginTop: {
    marginTop: '2rem',
  },
  marginBottom: {
    marginBottom: '1rem',
  },
  button: {
    backgroundColor: '#343a40', // gray 800
    border: '1px solid #343a40', // gray 800
    color: 'white',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '12px 16px',
    width: '300px',
    alignSelf: 'center',
  },
  centeredP: {
    textAlign: 'center',
    marginTop: '0.5rem',
    color: '#6c757d', // gray 600
  },
  footerP: {
    color: '#adb5bd', // gray 500
    fontSize: '12px',
    lineHeight: '1.25',
  },
};
