import React, { useEffect } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import { getCartList } from "../../features/cart/cartSlice";

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
        <div className="text-center">
          <img
            src="https://thumbnail.10x10.co.kr/webimage/image/basic600/341/B003419123.jpg?cmd=thumb&w=400&h=400&fit=true&ws=false"
            alt="Loading"
          />
        </div>
      ) : (
        <Row>
          {productList.length > 0 ? (
            productList.map((item) => (
              <Col md={3} sm={12} key={item._id}>
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
