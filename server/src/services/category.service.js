import { listCategories } from '../db/categoryRepo.js';

export async function list() {
  return listCategories();
}
