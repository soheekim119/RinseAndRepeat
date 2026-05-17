from pydantic import BaseModel
from typing import Optional

class CareResult(BaseModel):
    wash_temperature: Optional[str] = None
    dryer_safe: Optional[bool] = None
    dry_clean_only: Optional[bool] = None
    bleach_safe: Optional[bool] = None
    iron_safe: Optional[bool] = None
    special_instructions: Optional[str] = None
    material: Optional[str] = None
    confidence: Optional[str] = None
    raw_summary: str

