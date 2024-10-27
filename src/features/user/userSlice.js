import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      // 성공
      // 토큰값 저장
      sessionStorage.setItem("token", response.data.token);
      // 로그인 성공 시 유저 이름 포함한 메시지
      dispatch(
        showToastMessage({
          message: `${response.data.user.name}님, 쇼핑을 시작해볼까요?`,
          status: "success",
        })
      );
      //Loginpage
      return response.data;
    } catch (error) {
      // 실패
      // 실패시 생긴 에러값을 reducer에 저장
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {}
);

export const logout = () => (dispatch) => {
  dispatch(userSlice.actions.logout()); // logout 리듀서 액션을 호출하여 user 상태 초기화
  sessionStorage.removeItem("token"); // 세션 스토리지에서 토큰 제거
  // 로그아웃 알림 토스트 메시지 설정 (필요 시)
  dispatch(
    showToastMessage({ message: "로그아웃 되었습니다.", status: "info" })
  );
};

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user", { email, name, password });
      // 성공
      //1. 성공 토스트 메세지 보여주기
      dispatch(
        showToastMessage({
          message: "회원가입을 성공했습니다.",
          status: "success",
        })
      );
      //2. 로그인 페이지로 리다이렉트
      navigate("/login");

      return response.data.data;
    } catch (error) {
      //실패
      //1. 실패 토스트 메세지를 보여준다.
      dispatch(
        showToastMessage({
          message: "회원가입을 실패 했습니다.",
          status: "error",
        })
      );
      //2. 에러값을 저장한다.
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
    logout: (state) => {
      state.user = null; // 로그아웃 시 user를 null로 초기화
      state.success = false; // 필요시 다른 상태도 초기화 -> 리덕스를 잘 알아봐야 할듯 ㅠㅠ
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
    //.addCase(loginWithToken.pending, (state, action) => {}) 처음에 상품을 먼저 보여줄 것이기 때문에 빼줌
    //.addCase(loginWithToken.rejected, (state, action) => {}) 이것도 필요없다고 하시는데 아직 잘 모르겠다 ㅠㅠ
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
