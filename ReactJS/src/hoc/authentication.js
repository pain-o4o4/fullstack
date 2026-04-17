import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";

const locationHelper = locationHelperBuilder({});

// Khóa 1: Chỉ cần đã đăng nhập (Dùng chung cho những trang cần định danh)
export const userIsAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => state.user.isLoggedIn,
    wrapperDisplayName: 'UserIsAuthenticated',
    redirectPath: '/login'
});

// Khóa 2: Chỉ dành cho người CHƯA đăng nhập (Trang Login)
export const userIsNotAuthenticated = connectedRouterRedirect({
    authenticatedSelector: state => !state.user.isLoggedIn,
    wrapperDisplayName: 'UserIsNotAuthenticated',
    redirectPath: (state, ownProps) =>
        locationHelper.getRedirectQueryParam(ownProps)
        || '/' || '/login' || '/register',
    allowRedirectBack: false
});

// Khóa 3: CHỈ ADMIN (R1)
export const userIsAdmin = connectedRouterRedirect({
    authenticatedSelector:
        state => state.user.isLoggedIn &&
            state.user.userInfo &&
            state.user.userInfo.roleId === 'R1',
    wrapperDisplayName: 'UserIsAdmin',
    redirectPath: '/home',
    allowRedirectBack: false
});

// Khóa 4: CHỈ BÁC SĨ (R2)
export const userIsDoctor = connectedRouterRedirect({
    authenticatedSelector:
        state => state.user.isLoggedIn &&
            state.user.userInfo &&
            state.user.userInfo.roleId === 'R2',
    wrapperDisplayName: 'UserIsDoctor',
    redirectPath: '/home',
    allowRedirectBack: false
});

// Khóa 5: CHỈ BỆNH NHÂN (R3) - Nếu sau này Duy làm trang cá nhân cho Patient
export const userIsPatient = connectedRouterRedirect({
    authenticatedSelector:
        state => state.user.isLoggedIn &&
            state.user.userInfo &&
            state.user.userInfo.roleId === 'R3',
    wrapperDisplayName: 'UserIsPatient',
    redirectPath: '/home',
    allowRedirectBack: false
});