# School Catering Stock Management - Developer Guide

## Overview

The School Catering Stock Management MVP is a full-stack web application built for managing inventory in school catering operations. It provides comprehensive stock tracking, receipt management, production planning, and inventory analytics.

## Architecture

### Technology Stack

- **Backend**: FastAPI (Python 3.12) with SQLAlchemy ORM
- **Database**: SQLite (development) / PostgreSQL (production ready)
- **Frontend**: React 18 with TypeScript, Vite build tool
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **Charts**: Recharts library

### Project Structure

```
stoxckcheck/
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # FastAPI app entry point
│   │   ├── database.py     # Database configuration
│   │   ├── models.py       # SQLAlchemy models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── seed_data.py    # Initial data seeding
│   │   └── routers/        # API route handlers
│   │       ├── inventory.py # Core inventory operations
│   │       ├── voice.py    # Voice interface endpoints
│   │       └── agent.py    # AI agent endpoints
│   ├── tests/              # Backend tests
│   ├── pyproject.toml      # Poetry dependencies
│   └── catering.db         # SQLite database file
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript type definitions
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # npm dependencies
└── README.md               # Project overview
```

## Development Setup

### Prerequisites

- Python 3.12+
- Node.js 18+
- Poetry (Python package manager)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   poetry install
   ```

3. **Start development server**:
   ```bash
   poetry run fastapi dev app/main.py
   ```

   The backend will be available at `http://localhost:8000`
   - API documentation: `http://localhost:8000/docs`
   - Health check: `http://localhost:8000/healthz`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

### Database Setup

The application uses SQLite for development with automatic database creation and seeding:

- Database file: `backend/catering.db`
- Seed data is automatically loaded on first run
- Tables are created automatically via SQLAlchemy

## API Documentation

### Core Endpoints

#### Inventory Management

- `POST /api/v1/receipts` - Create supplier receipt
- `POST /api/v1/production-runs` - Create production run
- `POST /api/v1/wastage` - Record wastage
- `POST /api/v1/transfers` - Create inter-site transfer
- `POST /api/v1/counts` - Perform cycle count

#### Data Retrieval

- `GET /api/v1/on-hand` - Get current inventory levels
- `GET /api/v1/movements` - Get stock movement history
- `GET /api/v1/items` - Get all items
- `GET /api/v1/sites` - Get all sites
- `GET /api/v1/suppliers` - Get all suppliers
- `GET /api/v1/recipes` - Get all recipes

#### Future Endpoints

- `POST /api/v1/voice/transcribe` - Speech-to-text
- `POST /api/v1/voice/synthesize` - Text-to-speech
- `POST /api/v1/agent/query` - AI agent queries

### Request/Response Examples

#### Create Receipt

```bash
curl -X POST "http://localhost:8000/api/v1/receipts" \
  -H "Content-Type: application/json" \
  -d '{
    "site_id": "site-1",
    "supplier_id": "supplier-1",
    "lines": [{
      "item_id": "item-1",
      "qty": 10,
      "uom": "ml",
      "unit_cost": 1.25,
      "lot": "LOT123",
      "expiry": "2025-12-31",
      "location_id": "location-1"
    }]
  }'
```

#### Get Inventory On Hand

```bash
curl "http://localhost:8000/api/v1/on-hand?site_id=site-1"
```

## Database Schema

### Core Models

#### Items
- `id`: Primary key
- `sku`: Stock keeping unit
- `name`: Item name
- `category`: Item category
- `storage_type`: chilled/frozen/ambient
- `base_uom`, `pack_uom`, `case_uom`: Units of measure
- `standard_cost`: Standard cost per base unit

#### Stock Movements
- `id`: Primary key
- `item_id`: Foreign key to items
- `movement_type`: receipt/production/wastage/transfer/adjustment
- `qty_base`: Quantity in base units
- `lot_id`: Foreign key to inventory lots
- `location_id`: Foreign key to locations
- `reference_id`: Reference to source transaction

#### Inventory Lots
- `id`: Primary key
- `item_id`: Foreign key to items
- `lot_code`: Lot identifier
- `expiry_date`: Expiration date
- `unit_cost`: Cost per unit for this lot

### Relationships

- Items have many Stock Movements
- Stock Movements belong to one Item, Location, and Lot
- Sites have many Locations
- Suppliers provide Items via Receipts

## Frontend Architecture

### Component Structure

```
src/components/
├── Dashboard.tsx           # Main dashboard with metrics
├── InventoryView.tsx       # Current stock levels
├── ReceiptForm.tsx         # Create supplier receipts
├── ProductionForm.tsx      # Production planning
├── WastageForm.tsx         # Wastage recording
├── TransferForm.tsx        # Inter-site transfers
├── CountForm.tsx           # Cycle counts
├── VoiceInterface.tsx      # Voice commands (future)
├── AgentInterface.tsx      # AI assistant (future)
└── ui/                     # shadcn/ui components
```

### State Management

- React hooks for local state
- API service layer for data fetching
- Real-time updates via polling (WebSocket ready)

### Type Safety

All API interactions are fully typed with TypeScript:

```typescript
interface CreateReceiptRequest {
  site_id: string;
  supplier_id: string;
  lines: {
    item_id: string;
    qty: number;
    uom: string;
    unit_cost: number;
    lot?: string;
    expiry?: string | null;
    location_id: string;
  }[];
}
```

## Testing

### Backend Testing

```bash
cd backend
poetry run pytest
```

### Frontend Testing

```bash
cd frontend
npm run test
```

## Deployment

### Backend Deployment

The FastAPI backend is containerization-ready:

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY pyproject.toml poetry.lock ./
RUN pip install poetry && poetry install --no-dev
COPY app ./app
CMD ["poetry", "run", "fastapi", "run", "app/main.py"]
```

### Frontend Deployment

Build for production:

```bash
cd frontend
npm run build
```

Deploy the `dist/` directory to any static hosting service.

### Environment Variables

#### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@host:port/db
CORS_ORIGINS=https://yourdomain.com
```

#### Frontend (.env)
```
VITE_API_URL=https://api.yourdomain.com
```

## Contributing

### Code Style

- **Backend**: Follow PEP 8, use Black formatter
- **Frontend**: Use Prettier, follow React best practices
- **Commits**: Use conventional commit messages

### Development Workflow

1. Create feature branch from main
2. Implement changes with tests
3. Run linting and tests locally
4. Create pull request
5. Address review feedback
6. Merge after approval

### Adding New Features

#### Backend API Endpoint

1. Add route to appropriate router file
2. Define Pydantic schemas in `schemas.py`
3. Add database models if needed in `models.py`
4. Write tests for the endpoint
5. Update API documentation

#### Frontend Component

1. Create component in `src/components/`
2. Add TypeScript types in `src/types/`
3. Integrate with API service layer
4. Add to main navigation if needed
5. Style with Tailwind CSS

## Troubleshooting

### Common Issues

#### CORS Errors
- Ensure backend CORS is configured for frontend URL
- Check that both servers are running

#### Database Issues
- Delete `catering.db` to reset database
- Check SQLAlchemy model definitions
- Verify seed data is loading correctly

#### Build Errors
- Clear node_modules and reinstall
- Check TypeScript type definitions
- Verify all imports are correct

### Performance Optimization

- Use React.memo for expensive components
- Implement pagination for large datasets
- Add database indexes for frequent queries
- Consider caching for static data

## Security Considerations

- Input validation via Pydantic schemas
- SQL injection prevention via SQLAlchemy ORM
- CORS configuration for production
- Environment variable management
- Authentication/authorization (future enhancement)

## Monitoring and Logging

- FastAPI automatic request logging
- Custom application logs via Python logging
- Frontend error boundaries
- Performance monitoring (future enhancement)

## Future Enhancements

### Planned Features

1. **Authentication & Authorization**
   - User management
   - Role-based access control
   - JWT token authentication

2. **Real-time Updates**
   - WebSocket integration
   - Live inventory updates
   - Notification system

3. **Mobile PWA**
   - Offline capability
   - Push notifications
   - Mobile-optimized UI

4. **Advanced Analytics**
   - Predictive analytics
   - Cost analysis
   - Waste reduction insights

5. **Integration APIs**
   - ERP system integration
   - Supplier catalog sync
   - Accounting system export

### Technical Debt

- Add comprehensive test coverage
- Implement proper error handling
- Add request/response validation
- Performance optimization
- Security hardening

## Support

For development questions or issues:

1. Check this documentation
2. Review API documentation at `/docs`
3. Check existing GitHub issues
4. Create new issue with detailed description

## License

[Add license information here]
