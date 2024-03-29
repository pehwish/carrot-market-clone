import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import { withApiSession } from '@libs/server/withSession';
import { Kind } from '@prisma/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;
  const product = await client.product.findUnique({
    where: {
      id: +id!, //OR logical operator
    },
    include: {
      //user:true 전체 유저 정보를 가져옴
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  const terms = product?.name.split(' ').map((word) => ({
    name: {
      contains: word,
    },
  }));
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms, // 비슷한 상품 검색
      AND: {
        // 현재 내꺼 빼고
        id: {
          not: product?.id,
        },
      },
    },
  });
  const isLiked = Boolean(
    await client.record.findFirst({
      where: {
        productId: product?.id,
        userId: product?.user.id,
        kind: Kind.Fav,
      },
      select: {
        id: true,
      },
    })
  );
  res.json({ ok: true, product, isLiked, relatedProducts });
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
);
