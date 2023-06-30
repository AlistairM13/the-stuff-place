import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from 'zod'
import { TRPCError } from "@trpc/server";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany();
  }),

  sell: privateProcedure.input(z.object({
    price: z.string().min(1, "Price must atleast be a single digit"),
    productName: z.string().min(5, "Product name must contain at least 5 character(s)").max(30, "Product name must be atmost 30 character(s)"),
    description: z.string().min(5, "Product description must contain at least 5 character(s)").max(30, "Product description must be atmost 30 character(s)"),
    category: z.string(),
    imageUrl: z.string().min(1, "Please upload an image of what you are selling")
  })).mutation(async ({ ctx, input }) => {
    const sellerId = ctx.userId
    const product = await ctx.prisma.product.create({
      data: {
        category: input.category,
        name: input.productName,
        description: input.description,
        price: input.price,
        imageUrl: input.imageUrl,
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
