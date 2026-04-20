# Formo

Math whiteboard for teachers. Click math keyboard → element lands on canvas. Drag, resize, export PNG. Seconds, not minutes.

## Stack

- Next.js 16 + React 19 + TypeScript
- Konva.js + react-konva (canvas)
- Zustand (state)
- TailwindCSS v4

## Dev

```bash
npm install
npm run dev    # http://localhost:3033
```

## Structure

```
src/
├── app/                 # Next.js App Router
├── components/
│   ├── Canvas/          # Konva stage + renderer + transformer
│   ├── Keyboard/        # math keyboard panel
│   └── Toolbar/         # save / load / export
├── store/               # Zustand store
├── lib/                 # elementFactory, exportPng, storage
└── types/               # BoardElement types
```

## MVP features

- [x] Canvas with draggable/resizable elements
- [x] Math keyboard: digits, operators, fraction, power, sqrt
- [x] Save/load boards via localStorage
- [x] Export to PNG (transparent or white bg)
- [x] Delete, duplicate, undo/redo
