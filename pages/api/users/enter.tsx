import twilio from 'twilio';
import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import smtpTransport from '@libs/server/email';

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  /**
   * req.body는 req 내용의 인코딩을 기준으로 parse 되기 떄문에
   * +'1234' 문자열 앞에 + 붙여주면 숫자로 바뀜
   * 1234+"" 숫자 => 문자
   *
   * upsert 생성할때나 수정할 때 사용
   */

  const { phone, email } = req.body;

  const user = phone ? { phone } : email ? { email } : null;

  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + '';
  /*if (email) {
    user = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (user) console.log('found user');
    if (!user) {
      console.log('Did not find. Will create.');
      user = await client.user.create({
        data: {
          name: 'Anonymous',
          email,
        },
      });
    }
    console.log(user);
  }

  if (phone) {
    user = await client.user.findUnique({
      where: {
        phone: +phone,
      },
    });
    if (user) console.log('found user');
    if (!user) {
      console.log('Did not find. Will create.');
      user = await client.user.create({
        data: {
          name: 'Anonymous',
          phone: +phone,
        },
      });
    }
    console.log(user);
  }
  const user = await client.user.upsert({
    where: {
      // ...(phone ? { phone: +phone } : {}),
      // ...(email ? { email } : {}),
      ...payload,
    },
    create: {
      name: 'Anonymous',
      // ...(phone && { phone: +phone }),
      // ...(email && { email }),
      ...payload,
    },
    update: {},
  });
  */

  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: 'Anonymous',
            ...user,
          },
        },
      },
    },
  });
  console.log(token);
  if (phone) {
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   to: process.env.MY_PHONE!,
    //   body: `Your login token is ${payload}`,
    // });
    // console.log(message);
  }

  if (email) {
    const mailOptions = {
      from: process.env.MAIL_ID,
      to: email,
      subject: 'Nomad Carrot Authentication Email',
      text: `Authentication Code : ${payload}`,
    };
    // const result = await smtpTransport.sendMail(
    //   mailOptions,
    //   (error, responses) => {
    //     if (error) {
    //       console.log(error);
    //       return null;
    //     } else {
    //       console.log(responses);
    //       return null;
    //     }
    //   }
    // );
    // smtpTransport.close();
    //console.log(result);
  }

  return res.json({
    ok: true,
  });
}

export default withHandler('POST', handler);
