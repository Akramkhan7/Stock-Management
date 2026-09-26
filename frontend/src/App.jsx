import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Auth pages
import Login from './pages/auth/ Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'

// Layout
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// App pages
import Dashboard from './pages/dashboard/Dashboard'
import Products from './pages/products/Products'
import Categories from './pages/categories/Categories'
import StockAvailability from './pages/stock/StockAvailability'
import ReorderingRules from './pages/stock/ReorderRules'
import Receipts from './pages/receipts/Receipts'
import DeliveryOrders from './pages/deliveries/DeliveryOrders'
import InternalTransfers from './pages/transfers/InternalTransfers'
import InventoryAdjustments from './pages/adjustments/InventoryAdjustments'
import MoveHistory from './pages/ledger/MoveHistory'
import Warehouses from './pages/warehouses/Warehouses'
import Settings from './pages/settings/Settings'
import Profile from './pages/profile/Profile'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected app shell */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/stock" element={<StockAvailability />} />
          <Route path="/reordering-rules" element={<ReorderingRules />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/deliveries" element={<DeliveryOrders />} />
          <Route path="/transfers" element={<InternalTransfers />} />
          <Route path="/adjustments" element={<InventoryAdjustments />} />
          <Route path="/ledger" element={<MoveHistory />} />
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App