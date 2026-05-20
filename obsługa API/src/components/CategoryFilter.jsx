function CategoryFilter({
    categories,
    category,
    setCategory,
  }) {
    return (
      <select
        value={category}
        onChange={(e) =>
          setCategory(e.target.value)
        }
      >
        <option value="">
          Wszystkie kategorie
        </option>
  
        {categories.map((item, index) => (
          <option
            key={index}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>
    );
  }
  
  export default CategoryFilter;
