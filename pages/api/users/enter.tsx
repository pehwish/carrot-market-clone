import withHandler from '@libs/server/withHandler';
import { NextApiRequest, NextApiResponse } from 'next';

import client from '@libs/server/client';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  /**
   * req.body는 req 내용의 인코딩을 기준으로 parse 되기 떄문에
   *
   */
  console.log(req.body);
  return res.status(200).end();
}

export default withHandler('POST', handler);
