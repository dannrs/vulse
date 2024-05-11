import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Text,
} from '@react-email/components';

interface VulseBetaRegistrationProps {
  name: string;
  email: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export default function VulseBetaRegistrationEmail({
  name,
  email,
}: VulseBetaRegistrationProps) {
  return (
    <Html>
      <Head />
      <Preview>Someone has requested to join Vulse beta</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Vulse beta request</Heading>
          <Text style={{ ...text, marginBottom: '14px' }}>
            {name} has requested access to the Vulse beta
          </Text>
          <code style={{ ...code, marginBottom: '40px' }}>
            Fullname: {name}
            <br />
            Email address: {email}</code>
          <Img
          src={`${baseUrl}/static/activity.svg`}
          width="28"
          height="28"
          alt="Notion's Logo"
        />
          <Text style={footer}>
            <Link
              href={baseUrl}
              target='_blank'
              style={{ ...link, color: '#898989' }}
            >
              Vulse
            </Link>
            &nbsp;|&nbsp;Quickly share your favorites
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

VulseBetaRegistrationEmail.PreviewProps = {
  name: 'John Doe',
  email: 'test@example.com',
} as VulseBetaRegistrationProps;

const main = {
  backgroundColor: '#ffffff',
};

const container = {
  paddingLeft: '12px',
  paddingRight: '12px',
  margin: '0 auto',
};

const h1 = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const link = {
  color: '#2754C5',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  textDecoration: 'underline',
};

const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0',
};

const footer = {
  color: '#898989',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px',
};

const code = {
  display: 'inline-block',
  padding: '16px 4.5%',
  width: '90.5%',
  backgroundColor: '#f4f4f4',
  borderRadius: '5px',
  border: '1px solid #eee',
  color: '#333',
};
