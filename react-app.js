const { useState, useEffect, useMemo } = React;

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Wireless Mouse', price: 899, category: 'Electronics', stock: 25, description: 'Ergonomic wireless mouse with adjustable DPI.' },
  { id: 2, name: 'Mechanical Keyboard', price: 2499, category: 'Electronics', stock: 10, description: 'RGB backlit mechanical keyboard with blue switches.' },
  { id: 3, name: 'Office Chair', price: 5499, category: 'Furniture', stock: 8, description: 'Comfortable office chair with lumbar support.' },
  { id: 4, name: 'Notebook', price: 99, category: 'Stationery', stock: 120, description: 'A5 size ruled notebook, 200 pages.' },
  { id: 5, name: 'Water Bottle', price: 399, category: 'Accessories', stock: 60, description: 'Insulated stainless steel bottle, 1L.' },
  { id: 6, name: 'Running Shoes', price: 3299, category: 'Footwear', stock: 15, description: 'Lightweight running shoes for daily training.' },
  { id: 7, name: 'Bluetooth Speaker', price: 1599, category: 'Electronics', stock: 30, description: 'Portable Bluetooth speaker with deep bass.' },
  { id: 8, name: 'Desk Lamp', price: 699, category: 'Furniture', stock: 20, description: 'LED desk lamp with adjustable brightness.' },
  { id: 9, name: 'Backpack', price: 1299, category: 'Accessories', stock: 18, description: 'Water-resistant laptop backpack with multiple compartments.' },
  { id: 10, name: 'Smartwatch', price: 4999, category: 'Electronics', stock: 12, description: 'Fitness tracking smartwatch with heart-rate monitor.' },
  { id: 11, name: 'Gaming Headset', price: 1899, category: 'Electronics', stock: 17, description: 'Surround sound headset with noise-cancelling mic.' },
  { id: 12, name: 'Coffee Mug', price: 249, category: 'Kitchen', stock: 50, description: 'Ceramic coffee mug, 350ml.' }
];

const EMPTY_FORM = {
  name: '',
  price: '',
  category: '',
  stock: '',
  description: ''
};

function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [viewMode, setViewMode] = useState('list');
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchText.trim().toLowerCase());
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  useEffect(() => {
    const body = document.body;
    if (!body) return;
    if (theme === 'dark') {
      body.classList.add('theme-dark');
    } else {
      body.classList.remove('theme-dark');
    }
  }, [theme]);

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((product) => {
      if (product.category) {
        set.add(product.category);
      }
    });
    return Array.from(set).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = products;

    if (searchQuery) {
      const query = searchQuery;
      list = list.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== 'all') {
      list = list.filter((product) => product.category === categoryFilter);
    }

    return list;
  }, [products, searchQuery, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, safePage, pageSize]);

  function handleViewModeChange(mode) {
    if (mode === viewMode) return;
    setViewMode(mode);
  }

  function handleSearchChange(event) {
    setSearchText(event.target.value);
  }

  function handleToggleTheme() {
    setTheme((previous) => (previous === 'light' ? 'dark' : 'light'));
  }

  function handleCategoryChange(nextCategory) {
    setCategoryFilter(nextCategory);
    setCurrentPage(1);
  }

  function handleStartAdd() {
    setEditingProduct(null);
    setFormValues(EMPTY_FORM);
    setFormErrors({});
  }

  function handleStartEdit(product) {
    setEditingProduct(product);
    setFormValues({
      name: product.name,
      price: String(product.price),
      category: product.category,
      stock: product.stock != null ? String(product.stock) : '',
      description: product.description || ''
    });
    setFormErrors({});
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    const errors = {};

    if (!formValues.name.trim()) {
      errors.name = 'Name is required';
    }

    if (formValues.price === '') {
      errors.price = 'Price is required';
    } else {
      const priceNumber = Number(formValues.price);
      if (Number.isNaN(priceNumber) || priceNumber < 0) {
        errors.price = 'Price must be a non-negative number';
      }
    }

    if (!formValues.category.trim()) {
      errors.category = 'Category is required';
    }

    if (formValues.stock !== '') {
      const stockNumber = Number(formValues.stock);
      if (Number.isNaN(stockNumber) || stockNumber < 0) {
        errors.stock = 'Stock must be a non-negative number';
      }
    }

    return errors;
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const payload = {
      name: formValues.name.trim(),
      price: Number(formValues.price),
      category: formValues.category.trim(),
      stock: formValues.stock === '' ? 0 : Number(formValues.stock),
      description: formValues.description.trim()
    };

    setProducts((prev) => {
      if (editingProduct) {
        return prev.map((product) =>
          product.id === editingProduct.id ? { ...product, ...payload } : product
        );
      }

      const maxId = prev.reduce(
        (max, product) => (product.id > max ? product.id : max),
        0
      );

      return [...prev, { id: maxId + 1, ...payload }];
    });

    setEditingProduct(null);
    setFormValues(EMPTY_FORM);
    setFormErrors({});
  }

  function handlePageChange(page) {
    if (page < 1 || page > totalPages || page === safePage) return;
    setCurrentPage(page);
  }

  const totalCount = filteredProducts.length;
  const showingCount = pageItems.length;

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-top">
          <h1>Product Management</h1>
          <span className="app-badge">React · Frontend Assignment</span>
        </div>
        <p className="subtitle">
          Manage products with search, pagination, and inline editing. Data lives only in the browser.
        </p>
      </header>

      <StatsBar products={products} />

      <Toolbar
        viewMode={viewMode}
        searchText={searchText}
        categoryFilter={categoryFilter}
        categories={categories}
        theme={theme}
        onSearchChange={handleSearchChange}
        onViewModeChange={handleViewModeChange}
        onCategoryChange={handleCategoryChange}
        onToggleTheme={handleToggleTheme}
        onAddClick={handleStartAdd}
      />

      <main className="main-layout">
        <section className="products-section">
          <div className="products-header-row">
            <h2>Products</h2>
            <span className="results-info">
              {totalCount === 0
                ? 'No products yet'
                : `Showing ${showingCount} of ${totalCount} products`}
            </span>
          </div>

          {viewMode === 'list' ? (
            <ProductTable products={pageItems} onEdit={handleStartEdit} />
          ) : (
            <ProductGrid products={pageItems} onEdit={handleStartEdit} />
          )}

          <Pagination
            totalPages={totalPages}
            currentPage={safePage}
            onPageChange={handlePageChange}
          />
        </section>

        <section className="form-section">
          <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
          {editingProduct && (
            <p className="form-caption">Currently editing: {editingProduct.name}</p>
          )}
          <ProductForm
            values={formValues}
            errors={formErrors}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
          />
        </section>
      </main>
    </div>
  );
}

function StatsBar({ products }) {
  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum, product) => sum + (product.stock || 0),
    0
  );
  const lowStockCount = products.filter(
    (product) => product.stock != null && product.stock > 0 && product.stock <= 5
  ).length;
  const totalValue = products.reduce(
    (sum, product) => sum + (product.price || 0) * (product.stock || 0),
    0
  );
  const formattedValue = '₹' + totalValue.toLocaleString('en-IN');

  return (
    <section className="stats-bar">
      <div className="stat-card">
        <span className="stat-label">Total products</span>
        <span className="stat-value">{totalProducts}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Total stock units</span>
        <span className="stat-value">{totalStock}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Low stock ( 5 units)</span>
        <span className="stat-value stat-value-warning">{lowStockCount}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Inventory value</span>
        <span className="stat-value">{formattedValue}</span>
      </div>
    </section>
  );
}

function Toolbar({
  viewMode,
  searchText,
  categoryFilter,
  categories,
  theme,
  onSearchChange,
  onViewModeChange,
  onCategoryChange,
  onToggleTheme,
  onAddClick
}) {
  return (
    <section className="controls-bar">
      <div className="search-container">
        <label htmlFor="search">Search by name</label>
        <input
          id="search"
          type="text"
          value={searchText}
          onChange={onSearchChange}
          placeholder="Type to search products..."
        />
        <span className="search-hint">Debounced by 500ms</span>
      </div>

      <div className="category-filter">
        <label htmlFor="categoryFilter">Category</label>
        <select
          id="categoryFilter"
          value={categoryFilter}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="all">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="view-toggle">
        <span>View:</span>
        <button
          type="button"
          className={viewMode === 'list' ? 'active' : ''}
          onClick={() => onViewModeChange('list')}
        >
          List
        </button>
        <button
          type="button"
          className={viewMode === 'card' ? 'active' : ''}
          onClick={() => onViewModeChange('card')}
        >
          Cards
        </button>
      </div>

      <div className="theme-toggle">
        <span>Theme:</span>
        <button
          type="button"
          className={theme === 'dark' ? 'active' : ''}
          onClick={onToggleTheme}
        >
          <span
            className={
              'theme-icon theme-icon-sun' +
              (theme === 'light' ? ' active' : '')
            }
            aria-hidden="true"
          />
          <span
            className={
              'theme-icon theme-icon-moon' +
              (theme === 'dark' ? ' active' : '')
            }
            aria-hidden="true"
          />
          <span className="sr-only">
            {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          </span>
        </button>
      </div>

      <div className="add-btn-wrapper">
        <button type="button" onClick={onAddClick}>+ Add Product</button>
      </div>
    </section>
  );
}

function getStockMeta(stock) {
  if (stock === 0) {
    return { label: 'Out of stock', className: 'stock-pill stock-pill-empty' };
  }
  if (stock <= 5) {
    return { label: 'Low stock · ' + stock, className: 'stock-pill stock-pill-low' };
  }
  return { label: 'In stock · ' + stock, className: 'stock-pill stock-pill-ok' };
}

function ProductTable({ products, onEdit }) {
  if (!products.length) {
    return <p className="empty-state">No products found.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const stockMeta = getStockMeta(product.stock);
            return (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>₹{product.price}</td>
                <td>
                  <span className={stockMeta.className}>{stockMeta.label}</span>
                </td>
                <td>
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ProductGrid({ products, onEdit }) {
  if (!products.length) {
    return <p className="empty-state">No products found.</p>;
  }

  return (
    <div className="card-grid">
      {products.map((product) => {
        const stockMeta = getStockMeta(product.stock);
        return (
          <article key={product.id} className="product-card">
            <header className="product-card-header">
              <h3>{product.name}</h3>
              <span className="chip">{product.category}</span>
            </header>
            <div className="product-card-body">
              <p className="price">₹{product.price}</p>
              <p className="stock">
                <span className={stockMeta.className}>{stockMeta.label}</span>
              </p>
              {product.description && (
                <p className="description">{product.description}</p>
              )}
            </div>
            <footer className="product-card-footer">
              <button type="button" onClick={() => onEdit(product)}>
                Edit
              </button>
            </footer>
          </article>
        );
      })}
    </div>
  );
}

function Pagination({ totalPages, currentPage, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={page === currentPage ? 'active' : ''}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

function ProductForm({ values, errors, onChange, onSubmit }) {
  return (
    <form className="product-form" onSubmit={onSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="name">
          Name<span className="required">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={onChange}
          placeholder="Product name"
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="price">
          Price (₹)<span className="required">*</span>
        </label>
        <input
          id="price"
          name="price"
          type="number"
          value={values.price}
          onChange={onChange}
          placeholder="0"
          min="0"
          step="0.01"
        />
        {errors.price && <p className="error-text">{errors.price}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="category">
          Category<span className="required">*</span>
        </label>
        <input
          id="category"
          name="category"
          type="text"
          value={values.category}
          onChange={onChange}
          placeholder="e.g. Electronics"
        />
        {errors.category && <p className="error-text">{errors.category}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="stock">Stock</label>
        <input
          id="stock"
          name="stock"
          type="number"
          value={values.stock}
          onChange={onChange}
          placeholder="0"
          min="0"
        />
        {errors.stock && <p className="error-text">{errors.stock}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={values.description}
          onChange={onChange}
          rows={3}
          placeholder="Optional description"
        />
      </div>

      <button type="submit" className="primary-btn">
        Save Product
      </button>
    </form>
  );
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
