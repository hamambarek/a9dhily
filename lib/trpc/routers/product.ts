import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/lib/trpc/server'

export const productRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().nullish(),
        category: z.string().optional(),
        country: z.string().optional(),
        minPrice: z.number().optional(),
        maxPrice: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, cursor, category, country, minPrice, maxPrice } = input

      const items = await ctx.db.product.findMany({
        take: limit + 1,
        where: {
          isActive: true,
          ...(category && { category }),
          ...(country && { country }),
          ...(minPrice && { price: { gte: minPrice } }),
          ...(maxPrice && { price: { lte: maxPrice } }),
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              country: true,
              city: true,
            },
          },
        },
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (items.length > limit) {
        const nextItem = items.pop()
        nextCursor = nextItem!.id
      }

      return {
        items,
        nextCursor,
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              country: true,
              city: true,
              isVerified: true,
            },
          },
        },
      })

      if (!product) {
        throw new Error('Product not found')
      }

      return product
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, 'Title is required'),
        description: z.string().min(10, 'Description must be at least 10 characters'),
        price: z.number().positive('Price must be positive'),
        currency: z.string().default('USD'),
        category: z.string().min(1, 'Category is required'),
        condition: z.enum(['NEW', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'POOR']),
        images: z.array(z.string()),
        location: z.string().min(1, 'Location is required'),
        country: z.string().min(1, 'Country is required'),
        city: z.string().min(1, 'City is required'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const product = await ctx.db.product.create({
        data: {
          ...input,
          sellerId: ctx.session.user.id,
        },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              country: true,
              city: true,
            },
          },
        },
      })

      return product
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().min(10).optional(),
        price: z.number().positive().optional(),
        currency: z.string().optional(),
        category: z.string().min(1).optional(),
        condition: z.enum(['NEW', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'POOR']).optional(),
        images: z.array(z.string()).optional(),
        location: z.string().min(1).optional(),
        country: z.string().min(1).optional(),
        city: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input

      // Check if user owns the product
      const existingProduct = await ctx.db.product.findUnique({
        where: { id },
        select: { sellerId: true },
      })

      if (!existingProduct || existingProduct.sellerId !== ctx.session.user.id) {
        throw new Error('Not authorized to update this product')
      }

      const product = await ctx.db.product.update({
        where: { id },
        data,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              country: true,
              city: true,
            },
          },
        },
      })

      return product
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Check if user owns the product
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
        select: { sellerId: true },
      })

      if (!product || product.sellerId !== ctx.session.user.id) {
        throw new Error('Not authorized to delete this product')
      }

      await ctx.db.product.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  getMyProducts: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { limit, cursor } = input

      const items = await ctx.db.product.findMany({
        take: limit + 1,
        where: { sellerId: ctx.session.user.id },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: 'desc' },
      })

      let nextCursor: typeof cursor | undefined = undefined
      if (items.length > limit) {
        const nextItem = items.pop()
        nextCursor = nextItem!.id
      }

      return {
        items,
        nextCursor,
      }
    }),
})
