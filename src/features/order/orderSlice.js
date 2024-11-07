import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartQty } from "../cart/cartSlice";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// Define initial state
const initialState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
  isOrderButtonDisabled: false, // OrderReceipt 비활성화 여부
};

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/order", payload);
      if (response.status !== 200) throw new Error(response.error);
      dispatch(
        showToastMessage({
          message: "주문이 완료되었습니다.",
          status: "success",
        })
      );
      dispatch(getCartQty());

      return response.data.orderNum;
    } catch (error) {
      dispatch(showToastMessage({ message: error.error, status: "error" }));
      return rejectWithValue(error.error);
    }
  }
);

export const checkOrderListStock = createAsyncThunk(
  "order/checkOrderListStock",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/order/check", payload);
      if (response.status !== 200) throw new Error(response.error);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/order/me");

      if (response.status !== 200) {
        throw new Error(response.error || "Failed to fetch order");
      }

      return response.data; // fulfilled 상태로 반환
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch order"); // rejected 상태로 반환
    }
  }
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/order", { params: { ...query } });

      if (response.status !== 200) throw new Error(response.error);

      return response.data; // 성공 시 fulfilled로 반환
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch order list"); // 실패 시 rejected로 반환
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/order/${id}`, { status });

      if (response.status !== 200) throw new Error(response.error);

      dispatch({
        message: "업데이트 완료.",
        status: "success",
      });

      return response.data; // 성공 시 fulfilled로 반환
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update order");
    }
  }
);

// Order slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.orderNum = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkOrderListStock.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isOrderButtonDisabled = false;
      })
      .addCase(checkOrderListStock.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.isOrderButtonDisabled = false; // 성공 시 활성화 유지
        console.log("Stock check fulfilled, button enabled");
      })
      .addCase(checkOrderListStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.isOrderButtonDisabled = true; // 오류 발생 시 비활성화
      })
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }) // getOrderList 상태 처리
      .addCase(getOrderList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload.data;
        state.totalPageNum = action.payload.totalPageNum; // 페이지 수 저장
      })
      .addCase(getOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateOrder 상태 처리
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload.data;
        state.orderList = state.orderList.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
