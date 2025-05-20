import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import toast from "react-hot-toast";

import { Footer, Navbar } from "../components";
import axios from "axios";
import "../styles/product.css";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
    toast.success("Added to cart");
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      try {
        // Fetch product details
        const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
        const data = response.data;
        setProduct(data);
        setLoading(false);

        // Fetch similar products
        const response2 = await axios.get(
          `https://fakestoreapi.com/products/category/${data.category}`
        );
        const data2 = response2.data;
        setSimilarProducts(data2);
        setLoading2(false);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setLoading(false);
        setLoading2(false);
      }
    };
    getProduct();
  }, [id]);

  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowProduct = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 col-sm-12 py-3">
              <div className="product-image-container">
                <img
                  className="img-fluid"
                  src={product.image}
                  alt={product.title}
                  style={{
                    height: '400px',
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              </div>
            </div>
            <div className="col-md-6 py-5">
              <div className="product-details">
                <div className="product-category mb-2">
                  <small className="text-muted">
                    <i className="fas fa-tag me-1"></i>
                    {product.category}
                  </small>
                </div>
                <h1 className="display-5 mb-3">{product.title}</h1>
                <div className="product-rating mb-3">
                  <span className="h4">
                    {product.rating && product.rating.rate}{' '}
                    <i className="fas fa-star text-warning"></i>
                  </span>
                </div>
                <div className="product-price mb-4">
                  <span className="h2 text-primary">
                    ${product.price}
                  </span>
                </div>
                <div className="product-description mb-4">
                  <p className="lead">{product.description}</p>
                </div>
                <div className="product-actions">
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => addProduct(product)}
                  >
                    <i className="fas fa-shopping-cart me-1"></i>
                    Add to Cart
                  </button>
                  <Link to="/cart" className="btn btn-outline-primary">
                    <i className="fas fa-shopping-bag me-1"></i>
                    Go to Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const Loading2 = () => {
    return (
      <>
        <div className="my-4 py-4">
          <div className="d-flex">
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
            <div className="mx-4">
              <Skeleton height={400} width={250} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowSimilarProduct = () => {
    return (
      <>
        <div className="py-4 my-4">
          <div className="d-flex">
            {similarProducts.map((item) => {
              return (
                <div key={item.id} className="product-card mx-4 text-center">
                  <div className="product-image">
                    <img
                      src={item.image}
                      alt={item.title}
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
                          addProduct(item);
                        }}
                      >
                        <i className="fas fa-shopping-cart"></i>
                      </button>
                      <Link to={`/product/${item.id}`} className="btn btn-light btn-sm">
                        <i className="fas fa-eye"></i>
                      </Link>
                    </div>
                  </div>
                  <div className="product-info p-3">
                    <div className="product-category mb-2">
                      <small className="text-muted">
                        <i className="fas fa-tag me-1"></i>
                        {item.category}
                      </small>
                    </div>
                    <h5 className="product-title mb-2">
                      {item.title.substring(0, 30)}...
                    </h5>
                    <div className="product-price mb-3">
                      <span className="h4 text-primary">
                        ${item.price}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block">
            <h2 className="text-center mb-4">
              <i className="fas fa-heart me-2"></i>You may also Like
            </h2>
            <Marquee pauseOnHover={true} pauseOnClick={true} speed={50}>
              {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;