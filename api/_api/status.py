import datetime
from collections import defaultdict
from typing import Literal
from api._api.Alerts import get_alert_type_by_times
from .source_types import AlertEntity


from .types import (
    PeriodEnum,
    StatusEnum,
    TrainStatus,
)

ACTIVE_ALERTS = [PeriodEnum.Breaking, PeriodEnum.Current]


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


def is_enum_greater(a: StatusEnum, b: StatusEnum):
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
            lambda r: is_enum_greater(status, statuses.get(r, StatusEnum.NORMAL)),
            affected_routes,
        )

        for route in routes_with_increases:
            if any(alert in ACTIVE_ALERTS for alert in alert_types):
                statuses[route] = status

    return [
        TrainStatus(train=train, status=status) for train, status in statuses.items()
    ]
