import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import {z} from 'zod'
export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany();
  }),
  sell:privateProcedure.input(z.object({
    price:z.string(),
    productName:z.string(),
    description:z.string(),
    category: z.string()
  })).mutation(async ({ctx, input})=>{
    const sellerId = ctx.userId
    const product = await ctx.prisma.product.create({
      data: {
        category:input.category,
        name:input.productName,
        description:input.description,
        price:input.price,
        sellerId: sellerId
      }
    })
    return product
  })
});
