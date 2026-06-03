enum INVOICE {
  CREATE = 'invoice.create',
  GET_BY_ID = 'get_by_id',
  UPDATE_BY_ID = 'update_by_id',
  DELETE_BY_ID = 'delete_by_id',
}

enum PRODUCT {
  CREATE = 'product.create',
  GET_LIST = 'product.get_list',
}

export const TCP_REQUEST_MESSAGE = {
  INVOICE,
  PRODUCT,
};
