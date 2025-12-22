import React, { useState, useEffect } from 'react';
import { NavDropdown, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Filter = () => {
  const navigate = useNavigate();

  // stateهای فیلتر
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');

  // گرفتن کتگوری‌ها و برندها
  useEffect(() => {
    const fetchCategories = async () => {
     const { data } = await axiosInstance.get('/api/products/categories');
      setCategories(data);
    };
  
    const fetchBrands = async () => {
      const { data } = await axiosInstance.get('/api/products/brands'); // اگر endpoint برند داری
      setBrands(data);
    };

    fetchCategories();
    fetchBrands();
  }, []);

  // Apply filter
  const handleApply = () => {
    const params = new URLSearchParams();

    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedBrand) params.append('brand', selectedBrand);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (sort) params.append('sort', sort);

    navigate(`/products/filter?${params.toString()}`);
  };

  return (
    <NavDropdown title="Filter" id="filter-dropdown">
      <div className="px-3 py-2" style={{ minWidth: '200px' }}>
        {/* Category */}
        <Form.Group className="mb-2">
          <Form.Label>Category</Form.Label>
          <Form.Select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories && categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Brand */}
        <Form.Group className="mb-2">
          <Form.Label>Brand</Form.Label>
          <Form.Select
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
          >
            <option value="">All Brands</option>
            {brands && brands.map((brand, index) => (
              <option key={index} value={brand}>{brand}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Price */}
        <Form.Group className="mb-2">
          <Form.Label>Min Price</Form.Label>
          <Form.Control
            type="number"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Max Price</Form.Label>
          <Form.Control
            type="number"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
          />
        </Form.Group>

        {/* Sort */}
        <Form.Group className="mb-2">
          <Form.Label>Sort By</Form.Label>
          <Form.Select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="">Default</option>
            <option value="price_desc">Most Expensive</option>
            <option value="price_asc">Cheapest</option>
            <option value="rating_desc">Top Rated</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" size="sm" className="mt-2" onClick={handleApply}>
          Apply Filter
        </Button>
      </div>
    </NavDropdown>
  );
};

export default Filter;



