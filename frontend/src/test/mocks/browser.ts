import {setupWorker} from "msw/browser"
import {http, HttpResponse} from "msw"

const API_BASE = "https://gdancik.pythonanywhere.com/api";

export const handlers = [
    http.post()
]
export const worker = setupWorker(...handlers);