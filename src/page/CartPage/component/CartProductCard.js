import React, { useState, useEffect } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { currencyFormat } from "../../../utils/number";
import {
  updateQty,
  deleteCartItem,
  getCartList,
} from "../../../features/cart/cartSlice";
import QuantitySelector from "./QuantitySelector"; // 새로 만든 컴포넌트 import
import { checkOrderListStock } from "../../../features/order/orderSlice";

const CartProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const { cartList } = useSelector((state) => state.cart); // 최신 cartList를 가져옴

  const handleQtyChange = async (id, value) => {
    await dispatch(updateQty({ id, value }));
    // updateQty가 완료된 후에만 getCartList 호출
    await dispatch(getCartList()); // 최신 cartList를 불러옴
  };

  const deleteCart = async (id) => {
    await dispatch(deleteCartItem(id));
    await dispatch(getCartList()); // 최신 cartList를 불러옴
  };

  // cartList가 변경될 때마다 checkOrderListStock 실행
  useEffect(() => {
    if (cartList.length > 0) {
      dispatch(
        checkOrderListStock({
          orderList: cartList.map((item) => ({
            productId: item.productId._id,
            price: item.productId.price,
            qty: item.qty,
            size: item.size,
          })),
        })
      );
    }
  }, [dispatch, cartList]);

  const stock = { ...item.productId.stock };
  const stockCount = stock[item.size];
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev); // 상태 변경
  };

  return (
    <div className="product-card-cart">
      <Row>
        <Col md={2} xs={12}>
          <img src={item.productId.image} width={112} alt="product" />
        </Col>
        <Col md={10} xs={12}>
          <div className="display-flex space-between">
            <h3>{item.productId.name}</h3>
            <button className="trash-button">
              <FontAwesomeIcon
                icon={faTrash}
                width={24}
                onClick={() => deleteCart(item._id)}
              />
            </button>
          </div>

          <div>
            <strong>₩ {currencyFormat(item.productId.price)}</strong>
          </div>
          <div>Size: {item.size}</div>
          <div>Total: ₩ {currencyFormat(item.productId.price * item.qty)}</div>
          {stockCount <= 10 ? (
            <div style={{ color: "red" }}>
              현재 남은 수량은 {stockCount}개 입니다.
            </div>
          ) : (
            <div style={{ color: "blue" }}>
              현재 남은 수량은 {stockCount}개 입니다.
            </div>
          )}
          <div>
            주문수량 : &nbsp;&nbsp;
            {!stockCount ? (
              <input
                type="text"
                className="qty-text disabled-input"
                value={`${item.qty}`} // 선택된 수량 표시
                readOnly
              />
            ) : (
              <QuantitySelector
                itemQty={item.qty}
                stockCount={stockCount}
                onSelectQty={(qty) => handleQtyChange(item._id, qty)}
                showDropdown={showDropdown}
                toggleDropdown={toggleDropdown}
              />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;
