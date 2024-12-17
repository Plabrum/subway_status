from typing import List, Optional, TypedDict


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
    """Type Returned by the MTA JSON endpoint"""

    id: str
    alert: Alert
