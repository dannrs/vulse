import { type NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import VulseBetaRegistrationEmail from '~/emails/email-template';
import { env } from '~/env';

const resend = new Resend(env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { name, email }: { name: string; email: string } = await request.json();
  try {
    if (email) {
      await resend.emails.send({
        from: 'Vulse <contact@mail.danni.my.id>',
        to: email,
        subject: 'Vulse Beta Request',
        react: VulseBetaRegistrationEmail({
          name,
          email,
        }),
      });
      return NextResponse.json({ success: true, message: 'Email sent' });
    }

    return NextResponse.json({ succes: false, message: 'No name or email provided' });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
