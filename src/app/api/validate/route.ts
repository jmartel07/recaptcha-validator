import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

interface reCaptchaResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  score: number;
  action: string;
}
export async function POST(request: NextRequest) {
  const data = await request.formData();
  const gRecaptchaToken = data.get('gRecaptchaToken');

  if (!gRecaptchaToken) {
    return new NextResponse(
      JSON.stringify({ name: 'Please provide a valid token' }),
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers':
            'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, ngrok-skip-browser-warning',
        },
      },
    );
  }

  const formData = `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${gRecaptchaToken}`;
  try {
    const res = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const reCaptchaResponseObject: reCaptchaResponse = res.data;

    if (reCaptchaResponseObject.success) {
      // Submit form to hubspot
      return new NextResponse(JSON.stringify(reCaptchaResponseObject), {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers':
            'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, ngrok-skip-browser-warning',
        },
      });
    } else {
      return new NextResponse(
        JSON.stringify({ name: 'Error with this token' }),
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers':
              'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, ngrok-skip-browser-warning',
          },
        },
      );
    }
  } catch (e) {
    console.log('recaptcha error:', e);
    return new NextResponse(JSON.stringify({ name: 'Error!' }), {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, ngrok-skip-browser-warning',
      },
    });
  }
}
