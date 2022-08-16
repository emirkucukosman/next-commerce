// Lib
import { prisma } from "@lib/prisma";
import { Prisma } from "@prisma/client";

export type OrderWithProducts = Prisma.OrderGetPayload<{
  include: {
    products: {
      include: {
        product: true;
      };
    };
  };
}>;

export const getByPaymentIntentId = async (paymentIntentId: string) => {
  return await prisma.order.findFirstOrThrow({
    where: {
      paymentIntentId,
    },
  });
};

export const getByUserId = async (userId: string) => {
  return await prisma.order.findMany({
    where: {
      userId,
      isVerified: true,
    },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });
};

export const updateIsVerified = async (id: number, isVerified: boolean) => {
  return await prisma.order.update({
    where: {
      id,
    },
    data: {
      isVerified,
    },
  });
};
