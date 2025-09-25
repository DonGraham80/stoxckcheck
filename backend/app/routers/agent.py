from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import os
from ..database import get_db

router = APIRouter(prefix="/api/v1/agent", tags=["agent"])

class AgentPlanRequest(BaseModel):
    query: str
    context: Dict[str, Any] = {}

class AgentPlanResponse(BaseModel):
    plan_id: str
    description: str
    steps: List[Dict[str, Any]]
    requires_confirmation: bool

class AgentExecuteRequest(BaseModel):
    plan_id: str
    confirmed: bool = False

@router.post("/plan", response_model=AgentPlanResponse)
async def create_agent_plan(
    request: AgentPlanRequest,
    db: Session = Depends(get_db)
):
    """Create an execution plan based on natural language query"""
    
    plan_id = f"plan-{hash(request.query) % 10000}"
    
    if "receive" in request.query.lower() or "delivery" in request.query.lower():
        plan = {
            "plan_id": plan_id,
            "description": f"Process delivery: {request.query}",
            "steps": [
                {"action": "create_receipt", "params": {"supplier_id": "demo", "site_id": "demo"}},
                {"action": "update_inventory", "params": {}}
            ],
            "requires_confirmation": True
        }
    elif "produce" in request.query.lower() or "recipe" in request.query.lower():
        plan = {
            "plan_id": plan_id,
            "description": f"Execute production: {request.query}",
            "steps": [
                {"action": "create_production_run", "params": {"recipe_id": "demo", "portions": 50}},
                {"action": "allocate_ingredients", "params": {"strategy": "FEFO"}}
            ],
            "requires_confirmation": True
        }
    elif "count" in request.query.lower() or "inventory" in request.query.lower():
        plan = {
            "plan_id": plan_id,
            "description": f"Perform inventory count: {request.query}",
            "steps": [
                {"action": "create_count", "params": {"site_id": "demo"}},
                {"action": "generate_adjustments", "params": {}}
            ],
            "requires_confirmation": True
        }
    else:
        plan = {
            "plan_id": plan_id,
            "description": f"General query: {request.query}",
            "steps": [
                {"action": "analyze_query", "params": {"query": request.query}},
                {"action": "provide_information", "params": {}}
            ],
            "requires_confirmation": False
        }
    
    return AgentPlanResponse(**plan)

@router.post("/execute")
async def execute_agent_plan(
    request: AgentExecuteRequest,
    db: Session = Depends(get_db)
):
    """Execute a confirmed agent plan"""
    if not request.confirmed:
        raise HTTPException(status_code=400, detail="Plan execution requires confirmation")
    
    return {
        "plan_id": request.plan_id,
        "status": "executed",
        "message": "Plan executed successfully (demo mode)"
    }

@router.get("/openapi")
async def get_openapi_spec():
    """Return OpenAPI specification for agent consumption"""
    return {
        "openapi": "3.1.0",
        "info": {"title": "School Catering Stock API", "version": "0.1.0"},
        "paths": {
            "/api/v1/receipts": {"post": {"summary": "Create receipt"}},
            "/api/v1/production-runs": {"post": {"summary": "Create production run"}},
            "/api/v1/wastage": {"post": {"summary": "Record wastage"}},
            "/api/v1/transfers": {"post": {"summary": "Create transfer"}},
            "/api/v1/counts": {"post": {"summary": "Perform count"}}
        }
    }
