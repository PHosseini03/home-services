"""Request models with strict validation."""
from datetime import date, timedelta
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from .validators import check_name, check_phone, clean_text

ServiceSlug = Literal["plumbing", "cleaning", "electrical", "hvac", "handyman"]
HomeSize = Literal["small", "medium", "large", "xl"]
Urgency = Literal["standard", "next_day", "emergency"]
TimeWindow = Literal["morning", "midday", "afternoon", "evening"]

MAX_BOOKING_DAYS = 90
ZIP_PATTERN = r"^\d{5}$"


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class EstimateRequest(Strict):
    service: ServiceSlug
    home_size: HomeSize = "medium"
    hours: float = Field(default=2, ge=1, le=12)
    urgency: Urgency = "standard"


class BookingRequest(Strict):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=20)
    service: ServiceSlug
    date: date
    time_window: TimeWindow
    zip: str = Field(pattern=ZIP_PATTERN)
    address: str = Field(min_length=5, max_length=160)
    notes: str = Field(default="", max_length=1000)

    @field_validator("name")
    @classmethod
    def _name(cls, v: str) -> str:
        return check_name(v)

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        return check_phone(v)

    @field_validator("address", "notes")
    @classmethod
    def _text(cls, v: str) -> str:
        return clean_text(v) if v else v

    @field_validator("date")
    @classmethod
    def _date(cls, v: date) -> date:
        today = date.today()
        if v <= today:
            raise ValueError("muss in der Zukunft liegen")
        if v > today + timedelta(days=MAX_BOOKING_DAYS):
            raise ValueError(f"darf höchstens {MAX_BOOKING_DAYS} Tage im Voraus liegen")
        return v
