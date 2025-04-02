import { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";

const Products = () => {
  return (
    <div>
      <h2>App 2: Products</h2>
      <ul>
        {[1, 2, 3, 4, 5].map((id) => (
          <li key={id}>
            <Link to={`/product/${id}`}>Product {id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ProductDetail = () => {
  const location = useLocation();
  const productId = location.pathname.split("/").pop();

  return (
    <div>
      <h2>App 2: Product Detail</h2>
      <p>Viewing product ID: {productId}</p>
      <div
        style={{ padding: "10px", border: "1px solid #ddd", marginTop: "10px" }}
      >
        <h3>Product {productId}</h3>
        <p>Price: $99.99</p>
        <p>Description: This is an example product with ID {productId}.</p>
      </div>
      <div style={{ marginTop: "20px" }}>
        <Link to="/products">Back to Products</Link>
      </div>
    </div>
  );
};

const Categories = () => {
  return (
    <div>
      <h2>App 2: Categories</h2>
      <ul>
        <li>Electronics</li>
        <li>Clothing</li>
        <li>Home & Garden</li>
        <li>Books</li>
        <li>Sports & Outdoors</li>
      </ul>
    </div>
  );
};

const Featured = () => (
  <div>
    <h2>App 2: Featured Products</h2>
    <p>Here are our featured products for this month!</p>
    <ul>
      <li>Featured Product 1</li>
      <li>Featured Product 2</li>
      <li>Featured Product 3</li>
    </ul>
    <Link to="/products">View All Products</Link>
  </div>
);

const NotFound = () => <h2>App 2: Page Not Found</h2>;

const hostOrigin = import.meta.env.VITE_HOST_ORIGIN || window.location.origin;

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  console.log("Guest App 2 rendering at path:", location.pathname);

  useEffect(() => {
    const handleNavigation = (event: CustomEvent<{ path: string }>) => {
      const path = event.detail.path;
      console.log(`Received navigation request to: ${path}`);

      if (location.pathname !== path) {
        console.log(`Navigating from ${location.pathname} to ${path}`);
        navigate(path);
      }
    };

    window.addEventListener("appNavigation", handleNavigation as EventListener);
    return () => {
      window.removeEventListener(
        "appNavigation",
        handleNavigation as EventListener
      );
    };
  }, [navigate, location.pathname]);

  useEffect(() => {
    console.log(`Route changed to: ${location.pathname}`);

    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: "routeChange",
          path: location.pathname,
          appId: "app2",
        },
        hostOrigin
      );
    }
  }, [location.pathname]);

  return (
    <div>
      <h1>Product Catalog (Guest App 2)</h1>
      <div
        style={{ background: "#f0f0f0", padding: "8px", marginBottom: "16px" }}
      >
        <p>Current path: {location.pathname}</p>
      </div>

      <nav
        style={{ marginBottom: "20px", padding: "10px", background: "#e0e0e0" }}
      >
        <Link to="/products" style={{ marginRight: "10px" }}>
          All Products
        </Link>
        <Link to="/categories" style={{ marginRight: "10px" }}>
          Categories
        </Link>
        <Link to="/products/featured" style={{ marginRight: "10px" }}>
          Featured
        </Link>
      </nav>

      <Routes>
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products/featured" element={<Featured />} />
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
