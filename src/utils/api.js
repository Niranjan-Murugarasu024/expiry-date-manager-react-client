const RAW_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050';
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');

/**
 * Register a new user
 * @param {Object} data - { name, email, password }
 */
export async function registerUser({ name, email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const resData = await response.json();

  if (!response.ok) {
    const errorMsg =
      resData.message ||
      (resData.errors && resData.errors.map((err) => err.msg).join(', ')) ||
      'Registration failed. Please try again.';
    throw new Error(errorMsg);
  }

  return resData;
}

/**
 * Authenticate user & get JWT token
 * @param {Object} data - { email, password }
 */
export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const resData = await response.json();

  if (!response.ok) {
    const errorMsg =
      resData.message ||
      (resData.errors && resData.errors.map((err) => err.msg).join(', ')) ||
      'Login failed. Invalid credentials.';
    throw new Error(errorMsg);
  }

  return resData;
}

/**
 * Get authorization headers
 */
function getAuthHeaders() {
  const token = localStorage.getItem('jwtToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

/**
 * Lookup UPC barcode in master catalog
 * @param {string} upc 
 */
export async function lookupCatalogByUpc(upc) {
  const response = await fetch(`${API_BASE_URL}/products/catalog/${encodeURIComponent(upc)}`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  return await response.json();
}

/**
 * Fetch paginated user products with optional search and date filters
 */
export async function fetchProducts(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Failed to fetch products');
  }
  return resData;
}

/**
 * Fetch a single product by ID
 */
export async function fetchProductById(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Failed to fetch product details');
  }
  return resData.product;
}

/**
 * Fetch product inventory statistics summary
 */
export async function fetchProductSummary() {
  const response = await fetch(`${API_BASE_URL}/products/summary`, {
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Failed to fetch inventory summary');
  }
  return resData.summary;
}

/**
 * Add a new product
 */
export async function createProduct(productData) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    credentials: 'include',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  const resData = await response.json();
  if (!response.ok) {
    const errorMsg =
      resData.message ||
      (resData.errors && resData.errors.map((err) => err.msg).join(', ')) ||
      'Failed to create product';
    throw new Error(errorMsg);
  }
  return resData;
}

/**
 * Update an existing product
 */
export async function updateProduct(id, productData) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  const resData = await response.json();
  if (!response.ok) {
    const errorMsg =
      resData.message ||
      (resData.errors && resData.errors.map((err) => err.msg).join(', ')) ||
      'Failed to update product';
    throw new Error(errorMsg);
  }
  return resData;
}

/**
 * Quick update product status ('active' | 'consumed' | 'discarded')
 */
export async function updateProductStatus(id, status) {
  const response = await fetch(`${API_BASE_URL}/products/${id}/status`, {
    method: 'PATCH',
    credentials: 'include',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Failed to update status');
  }
  return resData;
}

/**
 * Delete a product
 */
export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: getAuthHeaders(),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || 'Failed to delete product');
  }
  return resData;
}
