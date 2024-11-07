import React, { useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { currencyFormat } from "../../../utils/number";
import {
  updateQty,
  deleteCartItem,
  getCartList,
} from "../../../features/cart/cartSlice";
import QuantitySelector from "./QuantitySelector"; // 새로 만든 컴포넌트 import

const CartProductCard = ({ cartList, item }) => {
  const dispatch = useDispatch();

  const handleQtyChange = async (id, value) => {
    await dispatch(updateQty({ id, value }));
    // updateQty가 완료된 후에만 getCartList 호출
    dispatch(getCartList());
  };

  const deleteCart = async (id) => {
    await dispatch(deleteCartItem(id));
    dispatch(getCartList());
  };

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

              // <Form.Select
              //   onChange={(event) =>
              //     handleQtyChange(item._id, event.target.value)
              //   }
              //   required
              //   defaultValue={item.qty}
              //   className="qty-dropdown"
              // >
              //   {stockCount <= 10
              //     ? [...Array(stockCount)].map((_, index) => (
              //         <option key={index + 1} value={index + 1}>
              //           {index + 1}
              //         </option>
              //       ))
              //     : [...Array(10)].map((_, index) => (
              //         <option key={index + 1} value={index + 1}>
              //           {index + 1}
              //         </option>
              //       ))}
              // </Form.Select>
            )}
            {/*
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
              <option value={10}>10</option>
              */}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;
