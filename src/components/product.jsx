import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles/product.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    let componentMounted = true;
    const getProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://fakestoreapi.com/products/");
        if (componentMounted) {
          setData(response.data);
          setFilter(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons text-center py-5">
          <button
            className="btn btn-dark btn-sm m-2 px-4 rounded-pill"
            onClick={() => setFilter(data)}
          >
            <i className="fas fa-list me-2"></i>All Products
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2 px-4 rounded-pill"
            onClick={() => filterProduct("men's clothing")}
          >
            <i className="fas fa-male me-2"></i>Men's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2 px-4 rounded-pill"
            onClick={() => filterProduct("women's clothing")}
          >
            <i className="fas fa-female me-2"></i>Women's Clothing
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2 px-4 rounded-pill"
            onClick={() => filterProduct("jewelery")}
          >
            <i className="fas fa-gem me-2"></i>Jewelry
          </button>
          <button
            className="btn btn-outline-dark btn-sm m-2 px-4 rounded-pill"
            onClick={() => filterProduct("electronics")}
          >
            <i className="fas fa-laptop me-2"></i>Electronics
          </button>
        </div>

        {filter.map((product) => {
          return (
            <div
              key={product.id}
              className="col-md-4 col-sm-6 col-12 mb-4"
            >
              <div className="product-card h-100">
                <div className="product-image">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="img-fluid"
                    style={{
                      height: '300px',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                  <div className="product-overlay">
                    <button
                      className="btn btn-light btn-sm me-2"
                      onClick={() => {
                        toast.success("Added to cart");
                        addProduct(product);
                      }}
                    >
                      <i className="fas fa-shopping-cart"></i>
                    </button>
                    <Link to={`/product/${product.id}`} className="btn btn-light btn-sm">
                      <i className="fas fa-eye"></i>
                    </Link>
                  </div>
                </div>
                <div className="product-info p-3">
                  <div className="product-category mb-2">
                    <small className="text-muted">
                      <i className="fas fa-tag me-1"></i>
                      {product.category}
                    </small>
                  </div>
                  <h5 className="product-title mb-2">
                    {product.title.substring(0, 30)}...
                  </h5>
                  <p className="product-description text-muted mb-3">
                    {product.description.substring(0, 80)}...
                  </p>
                  <div className="product-price mb-3">
                    <span className="h4 text-primary">
                      ${product.price}
                    </span>
                  </div>
                  <div className="product-actions">
                    <Link
                      to={`/product/${product.id}`}
                      className="btn btn-outline-primary me-2"
                    >
                      View Details
                    </Link>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        toast.success("Added to cart");
                        addProduct(product);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center mb-4">
              <i className="fas fa-shopping-bag me-2"></i>Latest Products
            </h2>
            <hr className="border-primary" />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;