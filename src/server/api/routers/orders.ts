import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
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
    })
});
