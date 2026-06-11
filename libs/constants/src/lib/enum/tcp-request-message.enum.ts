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

enum USER {
  CREATE = 'user.create',
  GET_ALL = 'user.get_all',
}

enum KEYCLOAK {
  CREATE_USER = 'keycloak.crate_user',
}

enum AUTHORIZER {
  LOGIN = 'authorizer.login',
}

export const TCP_REQUEST_MESSAGE = {
  INVOICE,
  PRODUCT,
  USER,
  KEYCLOAK,
  AUTHORIZER,
};
