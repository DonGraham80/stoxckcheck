from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import inventory, voice, agent

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="School Catering Stock Management API",
    description="A comprehensive stock management system for school catering operations",
    version="0.1.0"
)

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(inventory.router)
app.include_router(voice.router)
app.include_router(agent.router)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {
        "message": "School Catering Stock Management API",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/healthz"
    }
