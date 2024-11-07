import React, { useEffect, useRef } from "react";

const QuantitySelector = ({
  itemQty,
  stockCount,
  onSelectQty,
  showDropdown,
  toggleDropdown,
}) => {
  const dropdownRef = useRef(null);

  const handleSelectQty = (qty) => {
    onSelectQty(qty);
    toggleDropdown(); // 선택 후 드롭다운을 닫음
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      toggleDropdown(); // 외부 클릭 시 드롭다운 닫힘
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div
      className="quantity-selector"
      style={{ position: "relative" }}
      ref={dropdownRef}
    >
      <input
        type="text"
        className="qty-text disabled-input"
        value={`${itemQty}`}
        readOnly
      />
      <button onClick={() => toggleDropdown()} className="dropdown-toggle">
        &nbsp;
      </button>
      {showDropdown && (
        <div className="dropdown-menu">
          {Array.from({ length: stockCount }, (_, i) => i + 1).map((qty) => (
            <div
              key={qty}
              className="dropdown-item"
              onClick={() => handleSelectQty(qty)}
            >
              {qty}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuantitySelector;
