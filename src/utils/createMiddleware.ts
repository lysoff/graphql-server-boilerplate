export const createMiddleware = (middleware: any, resolver: any) =>
  (parent: any, args: any, context: any, info: any) =>
    middleware(resolver, parent, args, context, info);