# Micro-Frontend Architecture with Framework Agnostic Communication

This repository demonstrates a flexible micro-frontend architecture that supports multiple frameworks (React, Vue) with seamless integration and communication between components. The architecture uses iframes for strong isolation while providing a unified user experience through synchronized routing and shared UI elements.

## 🚀 Features

- **Multi-Framework Support**: Integrate apps built with React, Vue, or any other framework
- **Framework-Agnostic Communication**: Core library works with any JavaScript framework
- **Isolated Execution**: Each micro-frontend runs in its own iframe for complete isolation
- **Synchronized Routing**: Client-side routing works across all micro-frontends
- **Dynamic Loading**: Lazy load micro-frontends based on user navigation
- **Bottom Sheet Integration**: Open any app in a bottom sheet without affecting the main content
- **Discoverable API**: Self-documenting API with TypeScript support
- **Vertical Splitting**: Clear separation between different functional areas

## 📦 Project Structure

```
├── packages/
│   ├── host-app/            # Main container application (React)
│   ├── guest-app-1/         # Settings application (React)
│   ├── guest-app-2/         # Product catalog (React)
│   ├── guest-app-3/         # Analytics dashboard (Vue)
│   └── core-lib/            # Shared communication library
│       ├── src/
│       │   ├── communication.ts      # Core messaging system
│       │   ├── adapters/
│       │   │   ├── react.tsx         # React-specific adapters
│       │   │   └── vue.ts            # Vue-specific adapters
│       │   └── index.ts              # Main exports
└── README.md
```

## 🔧 How It Works

### Host App

The host app serves as the container for all micro-frontends:

- Manages the overall layout and navigation
- Loads guest apps in iframes based on the current route
- Handles communication between micro-frontends
- Provides shared UI elements like the bottom sheet

### Guest Apps

Each guest app is a standalone application that:

- Has its own client-side router
- Communicates with the host via a standardized message protocol
- Can be developed and deployed independently
- Includes a manifest file that describes its routes and menu items

### Core Library

The core communication library:

- Provides a framework-agnostic API for messaging
- Handles route synchronization between host and guests
- Manages bottom sheet interactions
- Offers framework-specific adapters for React and Vue

## 🛠️ Technical Implementation

### Manifest Files

Each guest app includes a manifest file in its public directory:

```json
{
  "id": "app1",
  "name": "Settings App",
  "description": "Settings and configuration",
  "version": "1.0.0",
  "entryUrl": "http://localhost:5174",
  "routeRegex": "^\\/app1(\\/.*)?$",
  "menuItems": [
    {
      "id": "dashboard",
      "label": "Dashboard",
      "path": "/dashboard",
      "icon": "📊"
    },
    {
      "id": "settings",
      "label": "Settings",
      "path": "/settings",
      "icon": "⚙️"
    }
  ]
}
```

### Communication Protocol

Communication between host and guest apps uses the browser's `postMessage` API with a standardized message format:

```typescript
// Host to Guest: Request navigation
{
  type: 'navigate',
  path: '/dashboard',
  id: 'unique-id'
}

// Guest to Host: Report route change
{
  type: 'routeChange',
  path: '/settings',
  appId: 'app1'
}

// Guest to Host: Request to open bottom sheet
{
  type: 'openBottomSheet',
  appId: 'app2',
  path: '/products',
  height: '50vh'
}
```

### React Integration

```jsx
// In your React guest app
import { MicroFrontendProvider, useRouteSync, BottomSheetOpener } from 'core-lib/adapters/react';
import { useLocation, useNavigate } from 'react-router-dom';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Sync routes with the host
  useRouteSync(location.pathname, navigate);
  
  return (
    <div>
      <h1>Guest App</h1>
      <BottomSheetOpener appId="app3" path="/dashboard">
        Open Analytics
      </BottomSheetOpener>
      {/* Your routes */}
    </div>
  );
}

// Wrap your app with the provider
ReactDOM.createRoot(document.getElementById('root')).render(
  <MicroFrontendProvider guestId="app1">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MicroFrontendProvider>
);
```

### Vue Integration

```vue
<!-- In your Vue guest app -->
<template>
  <div>
    <h1>Vue Guest App</h1>
    <BottomSheetOpener appId="app2" path="/products">
      Open Products
    </BottomSheetOpener>
    <RouterView />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useRouteSync } from 'core-lib/adapters/vue';

const router = useRouter();
const route = useRoute();

// Sync routes with the host
useRouteSync(
  () => route.path,
  (path) => router.push(path)
);
</script>
```

## 🚦 Getting Started

### Prerequisites

- Node.js 16+ and pnpm
- Modern browser (Chrome, Firefox, Edge, Safari)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/MortezaMirjavadi/microfrontend-iframe.git
   cd microfrontend-iframe
   ```

2. Install dependencies for all packages:

   ```bash
   pnpm install
   ```

3. Start the development servers:

   ```bash
   # Start all apps in parallel
   pnpm run start
   
   # Or start individual apps
   pnpm run start:host
   pnpm run start:guest-app-1
   pnpm run start:guest-app-2
   pnpm run start:guest-app-3
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📝 Creating a New Guest App

1. Create a new project using your preferred framework
2. Add a manifest.json file in the public directory
3. Import and use the core communication library
4. Implement route synchronization with the host
5. Add the app to the host's configuration

### Example for a new React guest app

```bash
# Create a new React app
mkdir -p packages/guest-app-4
cd packages/guest-app-4
pnpm create vite@latest . -- --template react-ts
pnpm install
```

Add a manifest.json in the public directory and integrate with the core library as shown in the React integration example above.

## 🧪 Testing

Each package includes its own tests that can be run with:

```bash
cd packages/[package-name]
pnpm test
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Thanks to all the awesome open-source projects that made this possible
- Special thanks to the micro-frontend community for inspiration and best practices

---

## 📚 Further Reading

- [Micro Frontends](https://micro-frontends.org/)
- [Single-Spa](https://single-spa.js.org/)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Host App (React)                     │
│                                                             │
│  ┌───────────┐   ┌───────────────────────────────────────┐  │
│  │           │   │                                       │  │
│  │           │   │                                       │  │
│  │  Sidebar  │   │           Guest App (iframe)          │  │
│  │   Menu    │   │                                       │  │
│  │           │   │                                       │  │
│  │           │   │                                       │  │
│  └───────────┘   └───────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                     Bottom Sheet                        ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```
---

Built with ❤️ by [Morteza Mirjavadi](https://github.com/MortezaMirjavadi)
