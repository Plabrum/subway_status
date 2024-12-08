from typing import List, Optional, TypedDict

from pydantic import BaseModel


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

    start: str
    end: str | None
    report: str

    alert_id: str
    route_id: str
    affected_stops: list[Stop]
    alert_period: str
    alert_start: str
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


class MercuryEntitySelector(TypedDict, total=False):
    sort_order: str


class AlertPeriod(TypedDict):
    start: int
    end: int | None


class InformedEntity(TypedDict, total=False):
    agency_id: str
    route_id: Optional[str]
    stop_id: Optional[str]
    transit_realtime_mercury_entity_selector: Optional[MercuryEntitySelector]


class Translation(TypedDict):
    text: str
    language: str


class MTAText(TypedDict):
    translation: List[Translation]


class MercuryAlert(TypedDict):
    created_at: int
    updated_at: int
    alert_type: str
    display_before_active: int


Alert = TypedDict(
    "Alert",
    {
        "active_period": List[AlertPeriod],
        "informed_entity": List[InformedEntity],
        "header_text": MTAText,
        "description_text": MTAText,
        "transit_realtime.mercury_alert": MercuryAlert,  # String key
    },
)


class AlertEntity(TypedDict):
    id: str
    alert: Alert
