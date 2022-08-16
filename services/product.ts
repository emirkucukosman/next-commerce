import { prisma } from "@lib/prisma";

export const getProductsByCategory = async (category: string, page = 1) => {
  // Limit param is 10 by default
  const limit = 10;

  // Check if page is a valid number
  if (isNaN(page)) {
    page = 1;
  }

  // Count total products in category
  const total = await prisma.product.count({
    where: {
      categories: {
        some: {
          category: {
            slug: category,
          },
        },
      },
    },
  });

  // Get products in category
  const products = await prisma.product.findMany({
    take: limit,
    skip: limit * (page - 1),
    where: {
      categories: {
        some: {
          category: {
            slug: category,
          },
        },
      },
    },
  });

  // Calculate total pages
  const totalPage = Math.ceil(total / limit);

  // Return products and total pages
  return {
    products,
    totalPage,
  };
};

export const getProductById = async (id: number) => {
  return prisma.product.findFirst({
    where: {
      id,
    },
  });
};

export const getPopularProducts = async (page = 1) => {
  // Limit param is 10 by default
  const limit = 10;

  // Check if page is a valid number
  if (isNaN(page)) {
    page = 1;
  }

  // Count total products
  const total = await prisma.product.count();

  // Calculate total pages
  const totalPage = Math.ceil(total / limit);

  const products = await prisma.product.findMany({
    take: limit,
    skip: limit * (page - 1),
    orderBy: {
      rating: "desc",
    },
  });

  // Return products and total pages
  return {
    products,
    totalPage,
  };
};
