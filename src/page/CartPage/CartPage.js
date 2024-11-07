import React, { useState } from "react";
import { useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CartProductCard from "./component/CartProductCard";
import OrderReceipt from "../PaymentPage/component/OrderReceipt";
import "./style/cart.style.css";
import { getCartList } from "../../features/cart/cartSlice";
import { checkOrderListStock } from "../../features/order/orderSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartList, totalPrice, loading } = useSelector((state) => state.cart);
  const { isOrderButtonDisabled } = useSelector((state) => state.order);

  useEffect(() => {
    // 카트리스트 불러오기
    dispatch(getCartList());
  }, [dispatch]);

  useEffect(() => {
    console.log("중요", cartList);
    // cartList가 업데이트된 후에만 재고 확인
    if (cartList.length > 0) {
      dispatch(
        checkOrderListStock({
          orderList: cartList.map((item) => {
            return {
              productId: item.productId._id,
              price: item.productId.price,
              qty: item.qty,
              size: item.size,
            };
          }),
        })
      );
    }
  }, [dispatch, cartList]);

  if (loading) {
    // 로딩 중일 때 로딩 스피너 또는 메시지 표시
    return (
      <Container className="text-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
        <div>장바구니를 불러오는 중입니다...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col xs={12} md={7}>
          {cartList.length > 0 ? (
            cartList.map((item) => (
              <CartProductCard item={item} key={item._id} />
            ))
          ) : (
            <div className="text-align-center empty-bag">
              <h2>카트가 비어있습니다.</h2>
              <div>상품을 담아주세요!</div>
            </div>
          )}
        </Col>
        <Col xs={12} md={5}>
          <OrderReceipt
            cartList={cartList}
            totalPrice={totalPrice}
            isOrderButtonDisabled={isOrderButtonDisabled}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
