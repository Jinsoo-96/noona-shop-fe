import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/cart", { productId: id, size, qty: 1 });
      console.log("여기요", response);
      if (response.status !== 200) throw new Error(response.error);
      dispatch(
        showToastMessage({
          message: "카트에 아이템이 추가 되었습니다.",
          status: "success",
        })
      );
      console.log("여기2", response.data);
      return response.data.cartItemQty; // TODO -> 손 봐야하는것
    } catch (error) {
      dispatch(
        showToastMessage({
          message: error.error,
          status: "error",
        })
      );
      console.log("여기", error);
      return rejectWithValue(error.error);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart");
      if (response.status !== 200) throw new Error(response.error);
      return response.data.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "장바구니 목록을 불러오는데 실패했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await api.delete(`/cart/${id}`);
      if (response.status !== 200) throw new Error(response.error);

      dispatch(
        showToastMessage({
          message: "상품이 삭제되었습니다.",
          status: "success",
        })
      );

      return id; // 성공 시 삭제된 아이템의 id를 반환
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "상품 삭제에 실패했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/${id}`, { qty: value });
      if (response.status !== 200) throw new Error(response.error);
      return response.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "수량 변경에 실패했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart?countOnly=true");
      if (response.status !== 200) throw new Error(response.error);
      return response.data.cartItemQty;
    } catch (error) {}
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload; //TODO
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 장바구니 목록
      .addCase(getCartList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartList = action.payload;
        state.cartItemCount = action.payload.length;
        state.totalPrice = action.payload.reduce(
          (total, item) => total + item.productId.price * item.qty,
          0
        );
      })
      // 수량만 체크
      .addCase(getCartList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartQty.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartQty.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;
      })
      .addCase(getCartQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 장바구니 삭제
      .addCase(deleteCartItem.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        // 삭제된 아이템을 cartList에서 필터링하여 제거
        state.cartList = state.cartList.filter(
          (item) => item._id !== action.payload
        );
        // cartItemCount 업데이트
        state.cartItemCount -= 1;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.error = action.payload;
      })
      // 장바구니 수량 업데이트
      .addCase(updateQty.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQty.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        const { id, qty } = action.payload;
        const item = state.cartList.find((item) => item._id === id);
        if (item) {
          item.qty = qty; // 해당 아이템의 수량 업데이트
        }
      })
      .addCase(updateQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
