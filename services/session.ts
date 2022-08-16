// Lib
import { prisma } from "@lib/prisma";

export const getBySessionToken = async (sessionToken: string) => {
  return await prisma.session.findFirst({
    where: {
      sessionToken,
    },
  });
};
