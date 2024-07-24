import { Verification } from '~/emails/';

export default function VerificationEmail() {
  return <Verification token="randomToken" />;
}
