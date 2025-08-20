import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/lib/trpc/server'

export const messageRouter = createTRPCRouter({
  getByTransaction: protectedProcedure
    .input(z.object({ transactionId: z.string() }))
    .query(async ({ input, ctx }) => {
      const messages = await ctx.db.message.findMany({
        where: { transactionId: input.transactionId },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })

      return messages
    }),

  send: protectedProcedure
    .input(
      z.object({
        transactionId: z.string(),
        receiverId: z.string(),
        content: z.string().min(1),
        messageType: z.enum(['TEXT', 'IMAGE', 'FILE', 'SYSTEM']).default('TEXT'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const message = await ctx.db.message.create({
        data: {
          ...input,
          senderId: ctx.session.user.id,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      })

      return message
    }),
})
