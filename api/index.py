import datetime
import os

import requests
from dotenv import load_dotenv
from litestar import Litestar, get
from litestar.exceptions import HTTPException
from pydantic import BaseModel

from api._helpers.Alerts import group_alerts_by_train_and_type
from api._helpers.types import AlertEntity

load_dotenv()
mta_key: str | None = os.getenv("MTA_KEY")


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


@get("/api/alerts", response_model=list[AlertsResponse])
async def alerts() -> list[AlertsResponse]:
    """Fetch and process alerts from the MTA API."""
    uri = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json"
    try:
        response = requests.get(uri, headers={"x-api-key": mta_key}, timeout=5)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"MTA API Error - {str(e)}") from e

    entities: list[AlertEntity] = response.json().get("entity", [])
    now = datetime.datetime.now(datetime.UTC)
    return group_alerts_by_train_and_type(entities, now)


app = Litestar([alerts])
