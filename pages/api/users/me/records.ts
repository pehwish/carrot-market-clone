import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import { withApiSession } from '@libs/server/withSession';
import { Kind } from '@prisma/client';

export function getRecordKind(kind: any): Kind | undefined {
  if (!kind) {
    return undefined;
  }

  switch (kind) {
    case Kind.Purchase.toLowerCase():
      return Kind.Purchase;
    case Kind.Sale.toLowerCase():
      return Kind.Sale;
    case Kind.Fav.toLowerCase():
      return Kind.Fav;

    default:
      return undefined;
  }
}
//api/users/me/records?kind=fav
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
    query: { kind },
  } = req;

  const recordKind = getRecordKind(kind);

  if (recordKind) {
    const records = await client.record.findMany({
      where: {
        userId: user?.id,
        kind: recordKind,
      },
      include: {
        product: {
          include: {
            _count: {
              select: {
                records: {
                  where: {
                    kind: recordKind,
                  },
                },
              },
            },
          },
        },
      },
    });
    res.json({
      ok: true,
      records,
    });
  } else {
    res.json({
      ok: false,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
);
