/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/api/alerts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Alerts */
        get: operations["ApiAlertsAlerts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** AlertsResponse */
        AlertsResponse: {
            train: string;
            /** @default [] */
            past: components["schemas"]["Report"][];
            /** @default [] */
            current: components["schemas"]["Report"][];
            /** @default [] */
            future: components["schemas"]["Report"][];
            /** @default [] */
            breaking: components["schemas"]["Report"][];
        };
        /** Report */
        Report: {
            start: string;
            end?: null | string;
            report: string;
            alert_id: string;
            route_id: string;
            affected_stops: components["schemas"]["Stop"][];
            alert_period: string;
            alert_start: string;
            alert_end?: null | string;
            alert_type: string;
            alert_created: string;
            alert_updated: string;
            display_before_active?: null | number;
            header_text: string;
            description_text?: null | string;
        };
        /** Stop */
        Stop: {
            stop_id: string;
            stop_name: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    ApiAlertsAlerts: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Request fulfilled, document follows */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AlertsResponse"][];
                };
            };
        };
    };
}
