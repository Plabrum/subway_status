import os
import datetime
from typing import Optional, List, Dict, Union
from litestar import Litestar, get
from litestar.exceptions import HTTPException
from pydantic import BaseModel
import requests
import pytz
from dotenv import load_dotenv

load_dotenv()

# List of all trains
ALL_TRAINS = [
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
class Report(BaseModel):
    """
    Represents an individual alert report with details about
    the alert's start time, end time, and the description.

    Attributes:
        start (Optional[str]): The ISO-formatted start time of the alert.
        end (Optional[str]): The ISO-formatted end time of the alert.
        report (Optional[str]): The description or details of the alert.
    """

    start: Optional[str]
    end: Optional[str]
    report: Optional[str]


class AlertsResponse(BaseModel):
    """
    Represents the alerts associated with a specific train, organized by alert types.

    Attributes:
        train (str): The train route identifier (e.g., "A", "1").
        all_reports (Dict[str, List[Report]]): A dictionary categorizing alert reports
            by types such as "current", "future", "past", or "breaking".
    """

    train: str
    all_reports: Dict[str, List[Report]]


def utc_to_est(utc_dt: datetime.datetime, local_tz: pytz.timezone) -> datetime.datetime:
    """Convert UTC datetime to Eastern Time."""
    return utc_dt.replace(tzinfo=pytz.utc).astimezone(local_tz)


def nix_to_utc(timestamp: str) -> datetime.datetime:
    """Convert a Unix timestamp to UTC datetime."""
    return datetime.datetime.utcfromtimestamp(int(timestamp))


def nix_to_est(timestamp: str, local_tz: pytz.timezone) -> datetime.datetime:
    """Convert a Unix timestamp to Eastern Time."""
    return utc_to_est(nix_to_utc(timestamp), local_tz)


def get_alerts(
    mta_key: str, json_out: bool = False
) -> Union[dict, List[AlertsResponse]]:
    """Fetch and process alerts from the MTA API."""
    local_tz = pytz.timezone("US/Eastern")
    uri = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json"

    try:
        response = requests.get(uri, headers={"x-api-key": mta_key}, timeout=5)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"MTA API Error - {str(e)}") from e

    records = response.json().get("entity", [])
    train_dict: Dict[str, Dict[str, List[Report]]] = {
        train: {"current": [], "future": [], "past": [], "breaking": []}
        for train in ALL_TRAINS
    }

    now = local_tz.localize(datetime.datetime.now())

    for record in records:
        alert = record.get("alert", {})
        informed_entities = alert.get("informed_entity", [])
        active_period = alert.get("active_period", [{}])[0]

        alert_start = (
            nix_to_est(active_period.get("start", ""), local_tz)
            if "start" in active_period
            else None
        )
        alert_end = (
            nix_to_est(active_period.get("end", ""), local_tz)
            if "end" in active_period
            else None
        )
        alert_type: Optional[str] = None

        if alert_end is None:
            alert_type = "breaking"
        elif alert_end < now:
            alert_type = "past"
        elif now < alert_start:
            alert_type = "future"
        elif alert_start <= now <= alert_end:
            alert_type = "current"

        report_text = (
            alert.get("header_text", {}).get("translation", [{}])[0].get("text", "")
        )
        combined_report = Report(
            start=alert_start.isoformat() if alert_start else None,
            end=alert_end.isoformat() if alert_end else None,
            report=report_text,
        )

        for entity in informed_entities:
            train = entity.get("route_id")
            if train in train_dict:
                train_dict[train][alert_type].append(combined_report)

    if json_out:
        return train_dict
    else:
        return [
            AlertsResponse(train=train, all_reports=alerts)
            for train, alerts in train_dict.items()
        ]


@get("/api/alerts", response_model=List[AlertsResponse])
async def alerts(json_out: bool = True) -> List[AlertsResponse]:
    """API endpoint to fetch subway alerts."""
    mta_key = os.getenv("mta_key")
    if not mta_key:
        raise HTTPException(status_code=500, detail="MTA API key not found.")
    return get_alerts(mta_key=mta_key, json_out=json_out)


app = Litestar([alerts])
