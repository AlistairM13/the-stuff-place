import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from 'zod'
import { TRPCError } from "@trpc/server";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany();
  }),

  sell: privateProcedure.input(z.object({
    price: z.string(),
    productName: z.string(),
    description: z.string(),
    category: z.string()
  })).mutation(async ({ ctx, input }) => {
    const sellerId = ctx.userId
    const product = await ctx.prisma.product.create({
      data: {
        category: input.category,
        name: input.productName,
        description: input.description,
        price: input.price,
        sellerId: sellerId
      }
    })
    return product
  }),

  getUserProducts: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId
    const products = await ctx.prisma.product.findMany({
      where: { sellerId: userId },
      orderBy: [{ createdAt: "desc" }]
    })
    return products
  }),

  getProductById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const product = await ctx.prisma.product.findUnique({ where: { id: input } })
    if (!product) throw new TRPCError({ code: "NOT_FOUND" })

    return product
  })

});
