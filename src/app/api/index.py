from flask import Flask, jsonify, request
import os
import datetime
import requests
import pytz
from dotenv import load_dotenv

app = Flask(__name__)

all_trains = [
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
    "3",
    "2",
    "4",
    "5",
    "6",
    "7",
    "GS",
    "SI",
]


def get_alerts(mta_key, json_out=False) -> dict:
    local_tz = pytz.timezone("US/Eastern")  # use your local timezone name here

    def utc_to_est(utc_dt: datetime.datetime) -> datetime.datetime:
        local_dt = utc_dt.replace(tzinfo=pytz.utc).astimezone(local_tz)
        return local_dt

    def nix_to_utc(timestamp: str) -> datetime.datetime:
        int_timestamp = int(timestamp)
        return datetime.datetime.utcfromtimestamp(int_timestamp)

    def nix_to_est(timestamp: str) -> datetime.datetime:
        utc_time = nix_to_utc(timestamp)
        est_time = utc_to_est(utc_time)
        return est_time

    def str_format(dt: datetime.datetime) -> str:
        return dt.strftime("%Y-%m-%d %H:%M:%S")

    def time_convert(time: str) -> str:
        """Converts a nix timestamp or ISO form to a human-readable form."""
        if len(time) < 9:
            return time
        elif len(time) < 11:
            return str_format(nix_to_est(time))
        else:
            dt = datetime.datetime.fromisoformat(time)
            return str_format(dt)

    uri = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json"
    r = requests.get(uri, headers={"x-api-key": mta_key}, timeout=5)

    if r.status_code != 200:
        return {"body": f"MTA API Error - {r.status_code}"}

    records = r.json().get("entity", [])
    train_dict = {}

    def add_alert(train, alert_type, combined_report, hard_init=False):
        if hard_init:
            for t in train:
                train_dict[t] = {
                    "current": [],
                    "future": [],
                    "past": [],
                    "breaking": [],
                }
        else:
            if train not in train_dict:
                train_dict[train] = {
                    "current": [],
                    "future": [],
                    "past": [],
                    "breaking": [],
                }

            train_dict[train][alert_type].append(combined_report)

    add_alert(train=all_trains, alert_type=None, combined_report=None, hard_init=True)

    for record in records:
        now = pytz.timezone("US/Eastern").localize(datetime.datetime.now())
        alert_times = record["alert"].get("active_period", [{}])[0]
        alert_start = nix_to_est(alert_times.get("start"))
        iso_start = alert_start.isoformat() if alert_start else ""
        alert_type = None

        alert_end = nix_to_est(alert_times.get("end")) if "end" in alert_times else None
        iso_end = alert_end.isoformat() if alert_end else ""

        if alert_end is None:
            alert_type = "breaking"
        elif alert_end < now:
            alert_type = "past"
        elif now < alert_start:
            alert_type = "future"
        elif alert_start < now < alert_end:
            alert_type = "current"

        train = record["alert"]["informed_entity"][0].get("route_id")
        report = record["alert"]["header_text"]["translation"][0].get("text", "")

        combined_report = {"start": iso_start, "end": iso_end, "report": report}
        add_alert(train=train, alert_type=alert_type, combined_report=combined_report)

    if json_out:
        return train_dict
    else:
        return [
            {"train": train, "all_reports": reports}
            for train, reports in train_dict.items()
        ]


@app.route("/alerts", methods=["GET"])
def alerts():
    mta_key = os.environ.get("mta_key")
    json_out = request.args.get("json_out", "false").lower() == "true"
    alerts_data = get_alerts(mta_key=mta_key, json_out=json_out)
    return jsonify(alerts_data)


if __name__ == "__main__":
    load_dotenv()
    app.run(debug=True)
