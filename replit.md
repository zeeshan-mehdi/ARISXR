# 3D BPMN Visualizer

## Overview

This is a collaborative 3D BPMN (Business Process Model and Notation) visualization and editing application that allows users to upload BPMN XML files and explore business processes in an immersive 3D environment. Multiple users can view the same process simultaneously, edit elements in real-time, see each other's positions, and interact with process elements. The application is built as a full-stack web application with a React frontend using Three.js for 3D rendering and an Express backend with WebSocket support for real-time collaboration.

## Recent Changes (November 2025)

**WebXR Mixed Reality Support Added:**
- Full Meta Quest 3 support for immersive AR/MR experiences (immersive-ar mode)
- Full Apple Vision Pro support for immersive VR experiences (immersive-vr mode)
- WebXR integration using @react-three/xr for XR session management
- Automatic detection of device capabilities (AR vs VR mode)
- Passthrough mode on Quest 3 enables BPMN processes to overlay on real environment
- Fully immersive VR mode on Vision Pro for spatial process visualization
- Controller and hand tracking support for XR interactions on both devices
- Multi-mode architecture: works on desktop browsers, Meta Quest 3 (AR), and Apple Vision Pro (VR)
- XR button appears only on XR-capable devices with appropriate label per mode

**Editing Features Added:**
- Double-click any BPMN element to rename it
- Changes sync automatically to all connected users via WebSocket
- ElementEditor component provides inline editing with keyboard shortcuts (Enter to save, Escape to cancel)
- Updated Zustand store to handle element editing state and name updates

**Process Library:**
- Landing page with 7 pre-loaded sample processes of varying complexity
- One-click process selection for immediate 3D visualization
- Back to Library button for easy navigation
- Includes large complex processes (E-Commerce with 29 tasks, Insurance with 32 tasks)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for UI components
- Three.js via @react-three/fiber and @react-three/drei for 3D rendering
- Vite as the build tool and development server
- TailwindCSS with Radix UI components for styling
- Zustand for state management

**Key Design Decisions:**

1. **3D Rendering Approach**: Uses React Three Fiber to integrate Three.js declaratively with React, allowing component-based 3D scene composition. This provides better integration with React's lifecycle and state management compared to imperative Three.js.

2. **WebXR Integration**: Implements @react-three/xr v6+ for immersive XR experiences on Meta Quest 3 and Apple Vision Pro. Uses XR store-based architecture for session management. Supports both `immersive-ar` sessions (Meta Quest 3 with passthrough mode) and `immersive-vr` sessions (Apple Vision Pro). Automatically detects device capabilities and uses the appropriate session type. Desktop and XR modes share the same BPMN visualization components through a unified BPMNWorld component.

3. **BPMN Visualization**: Different BPMN element types (start events, end events, tasks, gateways) are rendered as distinct 3D shapes (spheres, boxes, octahedrons) with color coding for quick visual identification. Flow connections are rendered as lines with intermediate waypoints for better visual clarity.

4. **Layout System**: Implements an automatic graph layout algorithm that assigns hierarchical levels to BPMN elements based on their position in the process flow, spacing elements appropriately in 3D space for optimal viewing.

5. **State Management Pattern**: Uses Zustand stores with selector subscriptions for reactive state updates. Separates concerns into domain-specific stores (useBPMN for process data, useGame for application state, useAudio for sound control).

6. **Component Structure**: Separates 3D components (BPMNElement3D, FlowConnection, UserPresence) from UI components (UploadPanel, InfoPanel), maintaining clear boundaries between rendering layers. BPMNWorld component encapsulates all 3D visualization logic and works in both desktop and XR modes.

### Backend Architecture

**Technology Stack:**
- Express.js for HTTP server
- WebSocket (ws library) for real-time communication
- Drizzle ORM with PostgreSQL (configured but using in-memory storage currently)
- TypeScript throughout

**Key Design Decisions:**

1. **Dual Storage Strategy**: Implements an IStorage interface with an in-memory implementation (MemStorage) that can be swapped for a database-backed implementation without changing application logic. This supports rapid development while maintaining a path to persistence.

2. **WebSocket Communication Pattern**: Uses a centralized WebSocket server that manages client connections, broadcasts user presence updates, and synchronizes BPMN process state across all connected clients. Each message has a type field for routing different update categories.

3. **User Identity Management**: Automatically generates unique user IDs and assigns colors when clients connect, managing the user lifecycle through connection/disconnection events.

4. **Process Synchronization**: When one user uploads a BPMN file, the process is broadcast to all connected users so everyone sees the same visualization in real-time.

5. **HTTP/WebSocket Separation**: REST-like routes are prepared for future API endpoints while WebSocket handles all real-time collaborative features, keeping concerns properly separated.

### Data Storage Solutions

**Current Approach:**
- In-memory storage using JavaScript Maps for user data
- Process state synchronized via WebSocket messages (not persisted)
- Session data stored in memory

**Database Configuration:**
- Drizzle ORM configured with PostgreSQL dialect
- Schema defined in shared/schema.ts with users table
- Connection via DATABASE_URL environment variable using Neon serverless driver
- Migration files output to ./migrations directory

**Future Persistence Path:**
The storage interface supports easy migration to database persistence by implementing the IStorage interface with Drizzle queries instead of Map operations.

### Authentication and Authorization

Currently no authentication system is implemented. Users are identified by auto-generated IDs assigned at WebSocket connection time. Future implementation would likely involve:
- User registration/login through the existing user schema
- Session management (express-session infrastructure partially in place via connect-pg-simple dependency)
- WebSocket authentication via session tokens

## External Dependencies

### Third-Party Libraries

**3D Rendering:**
- @react-three/fiber: React renderer for Three.js
- @react-three/drei: Utilities and abstractions for common 3D patterns
- @react-three/postprocessing: Visual effects for enhanced rendering
- three: Core 3D engine
- vite-plugin-glsl: GLSL shader support for custom materials

**UI Components:**
- @radix-ui/*: Comprehensive set of accessible, unstyled UI primitives
- tailwindcss: Utility-first CSS framework
- class-variance-authority: Type-safe variant styling
- cmdk: Command menu component
- lucide-react: Icon library

**State & Data:**
- zustand: Lightweight state management
- @tanstack/react-query: Server state management (configured but not actively used)
- fast-xml-parser: BPMN XML parsing
- drizzle-orm & drizzle-zod: ORM and schema validation

**Real-time Communication:**
- ws: WebSocket server implementation
- Custom WebSocket protocol for process and presence updates

### External Services

**Database:**
- Neon serverless PostgreSQL (@neondatabase/serverless)
- Requires DATABASE_URL environment variable
- Configured for PostgreSQL dialect in Drizzle

**Development Tools:**
- Vite with HMR for frontend development
- tsx for running TypeScript on the server
- esbuild for production builds

### Integration Points

1. **BPMN File Upload**: Client-side file reading and XML parsing, no external BPMN service required
2. **WebSocket Server**: Self-hosted at /ws endpoint, protocol defined in server/websocket.ts
3. **Asset Loading**: Configured to handle GLTF/GLB models and audio files for potential future MR features
4. **Database**: Optional PostgreSQL connection for persistent storage when DATABASE_URL is provided