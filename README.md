# 🛒 E-commerce Montería — Frontend

Frontend con **Next.js 16** para la tienda mayorista de Montería, Córdoba.

## Stack

- **Next.js 16** — App Router + Turbopack
- **React 19** — UI library
- **TypeScript** — Tipado estático
- **Tailwind CSS v4** — Utilidades CSS
- **Zustand** — State management (próximo sprint)

## Requisitos

- Node.js >= 20.x
- npm >= 6.x
- Backend (Strapi) corriendo en `http://localhost:1337`

## Setup Rápido

```bash
# 1. Copiar variables de entorno
cp .env.example .env.local

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3000
```

## Scripts Disponibles

| Comando                | Descripción                                     |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Inicia Next.js en modo desarrollo con Turbopack |
| `npm run build`        | Compila para producción                         |
| `npm run start`        | Inicia en modo producción                       |
| `npm run lint`         | Ejecuta ESLint                                  |
| `npm run lint:fix`     | Corrige errores de ESLint                       |
| `npm run format`       | Formatea con Prettier                           |
| `npm run format:check` | Verifica el formato                             |
| `npm run type-check`   | Verifica tipos TypeScript                       |

## Estructura del Proyecto

```
src/
├── app/               # App Router (páginas y layouts)
│   ├── layout.tsx     # Layout raíz
│   └── page.tsx       # Home page
├── components/        # Componentes React
│   ├── ui/            # Componentes base (Button, Input, etc.)
│   ├── layout/        # Header, Footer, Navbar
│   └── product/       # Componentes de producto
├── hooks/             # Custom React hooks
├── lib/               # Utilidades y clientes API
│   ├── strapi.ts      # Cliente API tipado para Strapi
│   ├── constants.ts   # Constantes de la app
│   └── utils.ts       # Funciones utilitarias
├── stores/            # Estado global (Zustand)
└── types/             # Tipos TypeScript
    ├── api.ts         # Tipos de respuesta Strapi
    ├── product.ts     # Product, Category, PriceTier
    ├── order.ts       # Order, Payment
    └── customer.ts    # Customer
```

## Variables de Entorno

Ver `.env.example` para la lista completa.
