import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { z } from 'zod'

export const orderRouter = createTRPCRouter({
    placeOrder: privateProcedure.input(z.object({
        productId: z.string(),
        buyerId: z.string(),
        buyerName: z.string(),
        sellerId: z.string()
    })).mutation(({ ctx, input }) => {
        return ctx.prisma.order.create({
            data: {
                ...input
            }
        })
    }),

    getOrdersOnProduct: privateProcedure.input(z.string())
        .query(async ({ ctx, input }) => {
            const products = await ctx.prisma.order.findMany({
                where: { productId: input },
                orderBy: [{ createdAt: "desc" }]
            })
            if (!products || !products[0]) return []
            if (products[0].sellerId == ctx.userId) { // If the seller and user logged in are same
                return products
            }
            return []
        })
});
