import { sleep, group } from 'k6'
import http from 'k6/http'

export const options = {
    ext: {
        loadimpact: {
            distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
            apm: [],
        },
    },
    thresholds: {},
    scenarios: {
        Scenario_1: {
            executor: 'ramping-vus',
            gracefulStop: '30s',
            stages: [
                { target: 50, duration: '10s' },
                { target: 50, duration: '30s' },
                { target: 0, duration: '10s' },
            ],
            gracefulRampDown: '30s',
            exec: 'scenario_1',
        },
    },
}

export function scenario_1 () {
    let response

    group('page_1 - http://localhost:3000/login', function () {
        response = http.post(
            'http://localhost:8800/api/auth/login',
            '{"username":"test3","password":"test3"}',
            {
                headers: {
                    accept: 'application/json, text/plain, */*',
                    'content-type': 'application/json',
                    'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                },
            }
        )

        response = http.options('http://localhost:8800/api/auth/login', null, {
            headers: {
                accept: '*/*',
                'access-control-request-headers': 'content-type',
                'access-control-request-method': 'POST',
                origin: 'http://localhost:3000',
                'sec-fetch-mode': 'cors',
            },
        })

        response = http.put(
            'http://localhost:8800/api/auth/login',
            '{"username":"test3","password":"test3"}',
            {
                headers: {
                    accept: 'application/json, text/plain, */*',
                    'content-type': 'application/json',
                    'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"macOS"',
                },
            }
        )
    })

    // Automatically added sleep
    sleep(1)
}