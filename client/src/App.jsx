import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import LayoutPage from "../lib/components/layout/layout.jsx";
import IndexPage from "./routes/index.jsx";
import LoginPage from "./routes/login.jsx";
import {AdminOnlyWrapper, AuthOnlyWrapper, UnauthOnlyWrapper} from "../lib/components/layout/auths.jsx";
import CMSIndexPage from "./routes/cms/index.jsx";
import RegisterPage from "./routes/register.jsx";
import ShopPage from "./routes/shop/index.jsx";
import ProductsPage from "./routes/shop/products.jsx";
import CMSCategoriesPage from "./routes/cms/categories.jsx";
import CMSLayout from "../lib/components/layout/cms.jsx";
import CMSUserPage from "./routes/cms/user.jsx";
import CMSOrdersPage from "./routes/cms/orders.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={
          <UnauthOnlyWrapper>
            <Outlet/>
          </UnauthOnlyWrapper>
        }>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
        </Route>

        <Route element={<LayoutPage/>}>
          <Route index element={<IndexPage/>}/>

          <Route path="/shop">
            <Route index element={<ShopPage/>} />
            <Route element={<AuthOnlyWrapper><Outlet/></AuthOnlyWrapper>}>
              <Route path="product/:id" element={<ProductsPage />} />
            </Route>
          </Route>

          <Route element={<AdminOnlyWrapper>
            <CMSLayout />
          </AdminOnlyWrapper>} path="/cms">
            <Route index element={<CMSIndexPage/>}/>
            <Route path="category" element={<CMSCategoriesPage />}/>
            <Route path="user" element={<CMSUserPage />}/>
            <Route path="order" element={<CMSOrdersPage />}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
