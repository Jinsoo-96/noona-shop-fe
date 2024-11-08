import React, { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import SkeletonCard from "./components/SkeletonCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import { getCartList } from "../../features/cart/cartSlice";
import "./style/landing.style.css";

const LandingPage = () => {
  const dispatch = useDispatch();

  const { productList, loading } = useSelector((state) => state.product || []);
  const [query, setQuery] = useSearchParams();
  const name = query.get("name");
  useEffect(() => {
    dispatch(
      getProductList({
        name,
      })
    );
  }, [query]);

  return (
    <Container>
      {loading ? (
        // 로딩 중일 때 스켈레톤 카드 12개 보여주기
        <Row className="g-3">
          {Array.from({ length: 24 }).map((_, index) => (
            <Col xs={6} md={4} lg={2} key={index}>
              <SkeletonCard />
            </Col>
          ))}
        </Row>
      ) : (
        <Row>
          {productList.length > 0 ? (
            productList.map((item) => (
              <Col xs={6} md={4} lg={2} key={item._id}>
                <ProductCard item={item} />
              </Col>
            ))
          ) : (
            <div className="text-align-center empty-bag">
              <h2>
                {name
                  ? `${name}과 일치한 상품이 없습니다!`
                  : "등록된 상품이 없습니다!"}
              </h2>
            </div>
          )}
        </Row>
      )}
    </Container>
  );
};

export default LandingPage;
