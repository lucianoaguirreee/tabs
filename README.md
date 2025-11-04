# Sistema de Tabs con Paneles Reorganizables

Un sistema de pestañas (tabs) ubicado en la parte inferior con vistas reorganizables al estilo VSCode, construido con Next.js 16, React 19 y TypeScript.

## Características

- **Tabs en la Parte Inferior**: Sistema de navegación con pestañas ubicadas en la parte inferior de la pantalla
- **4 Vistas Diferentes**:
  - Inicio (Dashboard)
  - Análisis
  - Reportes
  - Ajustes
- **Paneles Reorganizables**: Cada vista contiene 3-4 paneles que se pueden arrastrar y reorganizar al estilo VSCode
- **Diseño Responsivo**: Completamente adaptable con soporte para modo oscuro
- **Interfaz Moderna**: Construida con Tailwind CSS y componentes personalizados

## Tecnologías Utilizadas

- **Next.js 16** - Framework React con Turbopack
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **react-grid-layout** - Sistema de grid reorganizable
- **lucide-react** - Iconos modernos

## Instalación

```bash
npm install
```

## Uso

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Producción

```bash
npm run build
npm start
```

## Estructura del Proyecto

```
tabs/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página principal con configuración de tabs
│   └── globals.css         # Estilos globales
├── components/
│   ├── BottomTabsSystem.tsx    # Sistema de tabs principal
│   ├── DraggableGrid.tsx       # Grid reorganizable
│   └── panels/                 # Paneles individuales
│       ├── ChartPanel.tsx
│       ├── StatsPanel.tsx
│       ├── ListPanel.tsx
│       ├── InfoPanel.tsx
│       ├── CalendarPanel.tsx
│       ├── NotificationsPanel.tsx
│       ├── ProgressPanel.tsx
│       └── SettingsPanel.tsx
```

## Cómo Usar

### 1. Navegación entre Tabs

Haz clic en cualquiera de las pestañas en la parte inferior de la pantalla:
- **Inicio**: Vista de dashboard con estadísticas
- **Análisis**: Vista de análisis con gráficos y calendario
- **Reportes**: Vista de reportes con información detallada
- **Ajustes**: Vista de configuración del sistema

### 2. Reorganizar Paneles

- Cada panel tiene una **barra de título** con 3 puntos que actúa como área de arrastre
- **Arrastra** cualquier panel desde su barra de título para moverlo
- **Redimensiona** los paneles arrastrando desde las esquinas
- Los paneles se ajustan automáticamente para evitar superposiciones

### 3. Personalizar Vistas

Para agregar o modificar paneles, edita el archivo `app/page.tsx`:

```typescript
// Ejemplo: Agregar un nuevo panel
const customPanels = [
  {
    id: 'mi-panel',
    title: 'Mi Panel Personalizado',
    content: <MiComponente />,
    defaultPosition: { x: 0, y: 0, w: 6, h: 3 }
  },
  // ... más paneles
];
```

### 4. Crear Nuevos Paneles

1. Crea un nuevo archivo en `components/panels/`:

```typescript
'use client';

import React from 'react';

export default function MiPanel() {
  return (
    <div className="h-full">
      {/* Tu contenido aquí */}
    </div>
  );
}
```

2. Impórtalo en `app/page.tsx`
3. Agrégalo a la configuración de paneles de cualquier vista

## Configuración del Grid

El sistema de grid utiliza estas propiedades:

- **cols**: Número de columnas (default: 12)
- **rowHeight**: Altura de cada fila en píxeles (default: 100)
- **x, y**: Posición del panel en la cuadrícula
- **w, h**: Ancho y alto del panel en unidades de grid

## Estilos y Temas

El proyecto utiliza Tailwind CSS con soporte para modo oscuro automático basado en las preferencias del sistema.

Para personalizar los colores, edita `app/globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

## Licencia

MIT
