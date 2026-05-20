import { useEffect, useState } from 'react'
import ProductsList from './components/ProductsList'
import SearchBar from './components/SearchBar'
import CategoryFilter from './components/CategoryFilter'

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const [limit, setLimit] = useState(12);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pobieranie danych
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Pobieranie produktów
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://dummyjson.com/products?limit=100"
      );

      if (!response.ok) {
        throw new Error("Błąd pobierania produktów");
      }

      const data = await response.json();

      setProducts(data.products);
      setFilteredProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Pobieranie kategorii
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://dummyjson.com/products/categories"
      );

      if (!response.ok) {
        throw new Error("Błąd pobierania kategorii");
      }

      const data = await response.json();

      // zamiana obiektów na stringi kategorii
      const categoryNames = data.map((item) => item.slug);

      setCategories(categoryNames);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtrowanie + wyszukiwanie + sortowanie
  useEffect(() => {
    let result = [...products];

    // wyszukiwanie
    if (search.trim()) {
      result = result.filter((product) =>
        product.title
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // filtrowanie kategorii
    if (category) {
      result = result.filter(
        (product) => product.category === category
      );
    }

    // sortowanie
    if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [products, search, category, sort]);

  return (
    <div className="container">
      <h1>Lista Produktów</h1>

      <div className="filters">
        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        <CategoryFilter
          categories={categories}
          category={category}
          setCategory={setCategory}
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sortowanie</option>
          <option value="price-asc">
            Cena rosnąco
          </option>
          <option value="price-desc">
            Cena malejąco
          </option>
        </select>

        <select
          value={limit}
          onChange={(e) =>
            setLimit(Number(e.target.value))
          }
        >
          <option value={6}>6</option>
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={50}>50</option>
        </select>
      </div>

      {loading && <p>Ładowanie...</p>}

      {error && (
        <p className="error">{error}</p>
      )}

      {!loading && !error && (
        <ProductsList
          products={filteredProducts.slice(
            0,
            limit
          )}
        />
      )}
    </div>
  );
}

export default App;
