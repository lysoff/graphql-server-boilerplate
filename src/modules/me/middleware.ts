export default async (
  resolver: any,
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  const result = await resolver(parent, args, context, info);
  return result;
}