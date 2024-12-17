import datetime
import re
from collections import defaultdict
from typing import Literal

from .stoplookup import stopLookup
from .types import (
    AlertEntity,
    AlertPeriod,
    AlertsResponse,
    InformedEntity,
    MTAText,
    PeriodEnum,
    Report,
    StatusEnum,
    Stop,
    TrainStatus,
)

ACTIVE_ALERTS = [PeriodEnum.Breaking, PeriodEnum.Current]


def isEnumGreater(a: StatusEnum, b: StatusEnum):
    get_value = {StatusEnum.NORMAL: 0, StatusEnum.WARNING: 1, StatusEnum.SUSPENDED: 2}
    return get_value[a] > get_value[b]


# Helpers
def get_status_for_trains(entities: list[AlertEntity]) -> list[TrainStatus]:
    now = datetime.datetime.now(datetime.UTC)
    statuses: dict[str, StatusEnum] = defaultdict(lambda: StatusEnum.NORMAL)

    for entity in entities:
        affected_routes: list[str] = [
            str(route_id)
            for en in entity["alert"]["informed_entity"]
            if (route_id := en.get("route_id")) is not None
        ]
        alert_types = [
            get_alert_type_by_times(now, period)
            for period in entity["alert"].get("active_period", [])
        ]
        alert_type = entity["alert"]["transit_realtime.mercury_alert"]["alert_type"]
        status = map_status_to_enum(alert_type)

        routes_with_increases = filter(
            lambda r: isEnumGreater(status, statuses.get(r, StatusEnum.NORMAL)),
            affected_routes,
        )

        for route in routes_with_increases:
            if any(alert in ACTIVE_ALERTS for alert in alert_types):
                statuses[route] = status

    return [
        TrainStatus(train=train, status=status) for train, status in statuses.items()
    ]


def map_status_to_enum(
    status: str,
) -> Literal[StatusEnum.WARNING, StatusEnum.SUSPENDED]:
    cancelation_keywords = ["Suspended", "Cancellations", "No Scheduled Service"]
    match status:
        # Check if any cancellation keyword is a substring of the status
        case status if any(keyword in status for keyword in cancelation_keywords):
            return StatusEnum.SUSPENDED
        # Default to Warning for all other statuses
        case _:
            return StatusEnum.WARNING


def group_alerts_by_train_and_type(
    entities: list[AlertEntity],
    selected_routes: list[str] | None = None,
) -> list[AlertsResponse]:
    """
    Groups alerts by train route and categorizes them by alert type.
    """
    now = datetime.datetime.now(datetime.UTC)
    routes_dict: dict[str, AlertsResponse] = {}
    for entity in entities:
        affected_routes = [
            en.get("route_id")
            for en in entity["alert"]["informed_entity"]
            if en.get("route_id")
        ]
        alert_periods = [
            (get_alert_type_by_times(now, period), period)
            for period in entity["alert"].get("active_period", [])
        ]
        for route in affected_routes:
            if not route:
                continue
            if selected_routes and route not in selected_routes:
                continue
            if route not in routes_dict:
                routes_dict[route] = AlertsResponse(train=route)
            for alert, periods in alert_periods:
                report = parse_entity(entity, str(alert), periods, route)
                getattr(routes_dict[route], str(alert)).append(report)
    return list(routes_dict.values())


def datetime_to_iso8601(dt: datetime.datetime) -> str:
    """Converts a datetime object to an ISO 8601-formatted string."""
    return dt.isoformat()


def timestamp_to_datetime(timestamp: int) -> datetime.datetime:
    """Converts a timestamp to a datetime object."""
    return datetime.datetime.fromtimestamp(timestamp, datetime.UTC)


def get_alert_type_by_times(now: datetime.datetime, period: AlertPeriod) -> PeriodEnum:
    """
    Returns the alert type based on its period relative to the current time.
    """
    start, end = period.get("start"), period.get("end")
    alert_start = timestamp_to_datetime(start)

    if alert_start is None:
        raise ValueError("No start time found in alert period")

    alert_end = timestamp_to_datetime(end) if end else None
    if alert_end is None:
        return PeriodEnum.Breaking
    if alert_end < now:
        return PeriodEnum.Past
    if now < alert_start:
        return PeriodEnum.Future
    return PeriodEnum.Current


def parse_text(mta_text: MTAText) -> str:
    """Extracts and formats English text from MTA text data."""
    translation = mta_text.get("translation", [])
    en = list(filter(lambda textdict: textdict.get("language") == "en", translation))
    text = en[0].get("text") if en else None
    if text is None:
        print("MTA TEXT", mta_text)
        raise ValueError("No English text found in MTA text data")
    return re.sub(r"(?<!\n)\n(?!\n)", " ", text).replace("\n\n", "\n")


def get_stops(informed_entities: list[InformedEntity]) -> list[Stop]:
    """Returns a list of Stop objects from informed entities."""
    affected_stops: list[Stop] = []
    for stop in informed_entities:
        stop_id = stop.get("stop_id")
        if stop_id:
            stop_name = stopLookup[stop_id].get("stop_name", str(stop_id))
            stop = Stop(stop_id=stop_id, stop_name=stop_name)
            affected_stops.append(stop)
    return affected_stops


def parse_entity(
    entity: AlertEntity,
    alert_period: str,
    period: AlertPeriod,
    route_id: str,
) -> Report:
    """Converts the MTA entity into the pydantic type."""
    period_end = period.get("end")

    description_text = (
        parse_text(entity["alert"].get("description_text", {}))
        if entity["alert"].get("description_text")
        else None
    )

    return Report(
        # New Fields
        alert_id=entity["id"],
        route_id=route_id,
        alert_period=alert_period,
        alert_start=datetime_to_iso8601(timestamp_to_datetime(period.get("start"))),
        alert_end=(
            datetime_to_iso8601(timestamp_to_datetime(period_end))
            if period_end
            else None
        ),
        alert_type=entity["alert"]["transit_realtime.mercury_alert"]["alert_type"],
        alert_created=datetime_to_iso8601(
            timestamp_to_datetime(
                entity["alert"]["transit_realtime.mercury_alert"]["created_at"]
            )
        ),
        alert_updated=datetime_to_iso8601(
            timestamp_to_datetime(
                entity["alert"]["transit_realtime.mercury_alert"]["updated_at"]
            )
        ),
        display_before_active=entity["alert"]["transit_realtime.mercury_alert"].get(
            "display_before_active"
        ),
        header_text=parse_text(entity["alert"]["header_text"]),
        description_text=description_text,
        affected_stops=get_stops(entity["alert"].get("informed_entity", [])),
    )
