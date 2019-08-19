const resolvers = {
    Query: {
        hello: (_: any, { name }: any) => `Bey ${name || 'World'}`,
    },
}

export { resolvers };