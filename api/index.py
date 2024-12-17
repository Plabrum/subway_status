import os
import requests
from dotenv import load_dotenv
from litestar import Litestar, get
from litestar.exceptions import HTTPException
from api._api.Alerts import group_alerts_by_train_and_type
from api._api.source_types import AlertEntity
from api._api.status import get_status_for_trains
from api._api.types import AlertsResponse, TrainStatus

load_dotenv()
mta_key: str | None = os.getenv("MTA_KEY")


def fetchJSONAlertsFromMTA() -> list[AlertEntity]:
    """Use the MTA Json Endpoint to fetch alerts"""
    uri = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json"
    try:
        response = requests.get(uri, headers={"x-api-key": mta_key}, timeout=5)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"MTA API Error - {str(e)}") from e

    return response.json().get("entity", [])


@get("/api/alerts", response_model=list[AlertsResponse])
async def all_alerts() -> list[AlertsResponse]:
    """Fetch and process alerts from the MTA API."""
    entities = fetchJSONAlertsFromMTA()
    return group_alerts_by_train_and_type(entities)


@get("/api/status", response_model=list[TrainStatus])
async def status() -> list[TrainStatus]:
    """Fetch and process alerts from the MTA API."""
    entities = fetchJSONAlertsFromMTA()
    return get_status_for_trains(entities)


@get("/api/alerts/{subway_line:str}", response_model=AlertsResponse)
async def alerts(subway_line: str) -> AlertsResponse | None:
    """
    Fetch and process alerts from the MTA API, filtering by subway line.

    Args:
        subway_line: The subway line to filter alerts for (e.g., "E" or "A").

    Returns:
        A list of filtered alerts based on the subway line.
    """
    entities = fetchJSONAlertsFromMTA()
    grouped_alerts = group_alerts_by_train_and_type(entities, [subway_line])
    if len(grouped_alerts) == 1:
        return grouped_alerts[0]
    else:
        return None


app = Litestar([all_alerts, alerts, status])
