import datetime
import os
from typing import List, TypedDict

import requests
from dotenv import load_dotenv
from litestar import Litestar, get
from litestar.exceptions import HTTPException
from pydantic import BaseModel

from .stoplookup import stopLookup

# List of all trains
ALL_TRAINS: List[str] = [
    "A",
    "C",
    "E",
    "B",
    "D",
    "F",
    "M",
    "G",
    "L",
    "J",
    "Z",
    "N",
    "Q",
    "R",
    "W",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "GS",
    "SI",
]


# Pydantic models for response validation


class Stop(BaseModel):
    """Represents an MTA stop"""

    stop_id: str
    stop_name: str


class Report(BaseModel):
    """
    Represents an individual alert report with details about
    the alert's start time, end time, and the description.

    Attributes:
        start (Optional[str]): The ISO-formatted start time of the alert.
        end (Optional[str]): The ISO-formatted end time of the alert.
        report (Optional[str]): The description or details of the alert.
    """

    start: str
    end: str | None
    report: str

    alert_id: str
    route_id: str
    affected_stops: List[Stop]
    alert_period: str
    alert_start: str
    alert_end: str | None
    alert_type: str
    alert_created: str
    alert_updated: str
    display_before_active: int | None
    header_text: str
    description_text: str | None


class ReportType(TypedDict):
    """
    Represents the categorization of reports based on their time relevance.

    Attributes:
        past (List[Report]): Reports for alerts that have ended.
        current (List[Report]): Reports for alerts that are currently active.
        future (List[Report]): Reports for alerts scheduled for the future.
        breaking (List[Report]): Reports for alerts with no defined end time.
    """

    past: List[Report]
    current: List[Report]
    future: List[Report]
    breaking: List[Report]


class AlertsResponse(BaseModel):
    """
    Represents the alerts associated with a specific train, organized by alert types.

    Attributes:
        train (str): The train route identifier (e.g., "A", "1").
        all_reports (Dict[str, List[Report]]): A dictionary categorizing alert reports
            by types such as "current", "future", "past", or "breaking".
    """

    train: str
    all_reports: ReportType = ReportType(
        past=[],
        current=[],
        future=[],
        breaking=[],
    )


# Helpers
def group_alerts_by_train_and_type(
    entities: List[any], now: datetime.datetime
) -> List[AlertsResponse]:
    """
    Groups alerts by train route and categorizes them by alert type.
    """
    routes_dict = {}
    for entity in entities:
        affected_routes = [
            en.get("route_id")
            for en in entity["alert"]["informed_entity"]
            if en.get("route_id")
        ]
        alert_periods = [
            (get_alert_type_by_times(now, period), period)
            for period in entity["alert"].get("active_period")
        ]
        for route in affected_routes:
            if route not in routes_dict:
                routes_dict[route] = AlertsResponse(train=route)
            for alert, periods in alert_periods:
                try:
                    report = parse_entity(entity, alert, periods, route)
                except Exception as e:
                    raise e
                routes_dict[route].all_reports[alert].append(report)
    return list(routes_dict.values())


def datetime_to_iso8601(dt: datetime.datetime) -> str:
    """Converts a datetime object to an ISO 8601-formatted string"""
    return dt.isoformat() if dt else None


def timestamp_to_datetime(timestamp: int | None) -> datetime.datetime:
    """Converts a timestamp to a datetime object"""
    return (
        datetime.datetime.fromtimestamp(timestamp, datetime.UTC) if timestamp else None
    )


def get_alert_type_by_times(now: datetime.datetime, period) -> str:
    """
    Returns the alert type based on its period relative to the current time.
    """
    # TODO: convert to typed enum
    start, end = period.get("start"), period.get("end")
    alert_start = timestamp_to_datetime(start)
    alert_end = timestamp_to_datetime(end)
    if alert_end is None:
        return "breaking"
    if alert_end < now:
        return "past"
    if now < alert_start:
        return "future"
    return "current"


def parse_text(mta_text: list[dict[str, str]]):
    """Extracts and formats English text from MTA text data."""
    en = list(filter(lambda textDict: textDict.get("language") == "en", mta_text))
    if not en:
        raise ValueError("No English text found in MTA text data")
    text = en[0].get("text")
    return text.replace("\\n\\n", " ")


def get_stops(informd_entities) -> List[Stop]:
    """Returns a list of Stop objects from informed entities."""
    affected_stops = []
    for stop in informd_entities:
        stop_id = stop.get("stop_id")
        if stop_id:
            stop_name = stopLookup[stop_id].get("stop_name", str(stop_id))
            stop = Stop(stop_id=stop_id, stop_name=stop_name)
            affected_stops.append(stop)
    return affected_stops


def parse_entity(entity, alert_period, period, route_id) -> Report:
    """Converts the MTA entity into the pydantic type"""
    # TODO: improve concision
    alert_id = entity["id"]
    alert_start = datetime_to_iso8601(timestamp_to_datetime(period.get("start")))
    alert_end = datetime_to_iso8601(timestamp_to_datetime(period.get("end")))
    alert_type = entity["alert"]["transit_realtime.mercury_alert"]["alert_type"]
    alert_created = datetime_to_iso8601(
        timestamp_to_datetime(
            entity["alert"]["transit_realtime.mercury_alert"]["created_at"]
        )
    )
    alert_updated = datetime_to_iso8601(
        timestamp_to_datetime(
            entity["alert"]["transit_realtime.mercury_alert"]["updated_at"]
        )
    )
    display_before_active = entity["alert"]["transit_realtime.mercury_alert"].get(
        "display_before_active"
    )
    header_text = parse_text(entity["alert"]["header_text"]["translation"])
    description_text = (
        parse_text(entity["alert"]["description_text"]["translation"])
        if entity["alert"].get("description_text")
        else None
    )
    affected_stops = get_stops(entity["alert"].get("informed_entity"))

    return Report(
        # Deprecated Fields
        start=alert_start,
        end=alert_end,
        report=header_text,
        # New Fields
        alert_id=alert_id,
        route_id=route_id,
        alert_period=alert_period,
        alert_start=alert_start,
        alert_end=alert_end,
        alert_type=alert_type,
        alert_created=alert_created,
        alert_updated=alert_updated,
        display_before_active=display_before_active,
        header_text=header_text,
        description_text=description_text,
        affected_stops=affected_stops,
    )


@get("/api/alerts", response_model=List[AlertsResponse])
async def alerts() -> List[AlertsResponse]:
    """Fetch and process alerts from the MTA API."""
    uri = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json"
    try:
        response = requests.get(uri, headers={"x-api-key": mta_key}, timeout=5)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"MTA API Error - {str(e)}") from e

    entities = response.json().get("entity", [])
    now = datetime.datetime.now(datetime.UTC)
    return group_alerts_by_train_and_type(entities, now)


load_dotenv()
mta_key = os.getenv("MTA_KEY")
app = Litestar([alerts])
