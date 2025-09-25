# School Catering Stock Management MVP

A comprehensive stock management system for school catering operations.

## Features

- **Inventory Management**: Track stock levels, expiry dates, and locations
- **Receipt Processing**: Record deliveries from suppliers
- **Production Management**: Recipe-based production with FEFO (First Expired, First Out) logic
- **Transfer Management**: Inter-site stock transfers
- **Cycle Counts**: Inventory adjustments and auditing
- **Wastage Tracking**: Record and track waste with reasons
- **Voice Integration**: Speech-to-text and text-to-speech capabilities
- **Agent System**: AI-powered assistance with plan confirmation
- **PWA Support**: Offline-capable progressive web app

## Architecture

- **Backend**: FastAPI (Python) with PostgreSQL
- **Frontend**: React TypeScript PWA with Tailwind CSS
- **Real-time**: WebSocket connections for live updates
- **Voice**: ElevenLabs integration for STT/TTS
- **Agent**: OpenAPI-driven AI assistant

## Tech Stack

- FastAPI + PostgreSQL + SQLAlchemy
- React + TypeScript + Vite + PWA
- WebSockets for real-time updates
- ElevenLabs for voice processing
- OpenAI for agent capabilities

## Getting Started

### Backend Setup
```bash
cd backend
poetry install
poetry run fastapi dev app/main.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Core Workflows

1. **Receive**: Record supplier deliveries
2. **Produce**: Execute recipes with FEFO ingredient allocation
3. **Count**: Perform cycle counts and adjustments
4. **Transfer**: Move stock between sites (pick → receive)
5. **Wastage**: Record waste with reasons
6. **Reports**: View on-hand, near-expiry, and reorder reports

## Database Schema

The system uses an immutable movement ledger approach with FEFO enforcement and full audit trails.

## API Documentation

Once running, visit `/docs` for interactive API documentation.
