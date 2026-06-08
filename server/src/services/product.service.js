import { listProducts, findProductById } from '../db/productRepo.js';
import { notFound } from '../utils/ApiError.js';

export async function list(params) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 12;
  const { data, total } = await listProducts({ ...params, page, limit });
  return { data, page, limit, total };
}

export async function getById(id) {
  const product = await findProductById(id);
  if (!product) throw notFound('Product not found', 'PRODUCT_NOT_FOUND');
  return product;
}
