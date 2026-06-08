/**
 * Express middleware factory that validates req.body against a Zod schema.
 * On failure it calls next() with the ZodError so the central errorHandler
 * formats it into the standard { error: { message, code } } shape.
 *
 * @param {import('zod').ZodSchema} schema
 * @returns {import('express').RequestHandler}
 */
export default function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(result.error);
    }
    req.body = result.data;
    return next();
  };
}
