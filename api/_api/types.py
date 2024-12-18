from enum import Enum

from pydantic import BaseModel


class StatusEnum(Enum):
    """Reduced Status set derived from the MTA alert_type str field"""

    NORMAL = "normal"
    WARNING = "warning"
    SUSPENDED = "suspended"


class PeriodEnum(Enum):
    Breaking = "breaking"
    Current = "current"
    Past = "past"
    Future = "future"


class TrainStatus(BaseModel):
    """Pairing of a train str and Status Enum for homepage"""

    train: str
    status: StatusEnum


# Pydantic models for response validation
class Stop(BaseModel):
    """Represents an MTA stop"""

    stop_id: str
    stop_name: str


class Report(BaseModel):
    """
    Represents an individual alert report with details about
    the alert's start time, end time, and the description.
    """

    alert_id: str
    route_id: str
    affected_stops: list[Stop]
    alert_period: str
    alert_start: str
    alert_status: StatusEnum
    alert_end: str | None
    alert_type: str
    alert_created: str
    alert_updated: str
    display_before_active: int | None
    header_text: str
    description_text: str | None


class AlertsResponse(BaseModel):
    """
    Represents the alerts associated with a specific train, organized by alert types.
    """

    train: str
    past: list[Report] = []
    current: list[Report] = []
    future: list[Report] = []
    breaking: list[Report] = []
