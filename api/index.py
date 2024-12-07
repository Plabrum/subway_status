import datetime
import os

import requests
from dotenv import load_dotenv
from litestar import Litestar, get
from litestar.exceptions import HTTPException

from api._helpers.Alerts import group_alerts_by_train_and_type
from api._helpers.types import AlertEntity, AlertsResponse

load_dotenv()
mta_key: str | None = os.getenv("MTA_KEY")


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
