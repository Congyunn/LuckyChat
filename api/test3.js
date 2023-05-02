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

    group('page_1 - http://localhost:3000/', function () {
        response = http.get('http://localhost:8800/api/likes?postId=17', {
            headers: {
                accept: 'application/json, text/plain, */*',
                'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
            },
        })
        response = http.get('http://localhost:8800/api/likes?postId=15', {
            headers: {
                accept: 'application/json, text/plain, */*',
                'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
            },
        })
        response = http.get('http://localhost:8800/api/likes?postId=14', {
            headers: {
                accept: 'application/json, text/plain, */*',
                'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
            },
        })
        response = http.get('http://localhost:8800/api/likes?postId=6', {
            headers: {
                accept: 'application/json, text/plain, */*',
                'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
            },
        })
        response = http.get('http://localhost:8800/api/likes?postId=5', {
            headers: {
                accept: 'application/json, text/plain, */*',
                'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
            },
        })
        response = http.get('http://localhost:8800/api/users/find/3', {
            headers: {
                accept: 'application/json, text/plain, */*',
                'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
            },
        })
        response = http.get('http://localhost:8800/api/likes?postId=17', {
            headers: {
                accept: 'application/json, text/plain, */*',
                'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
            },
        })
        response = http.get('http://localhost:8800/api/likes?postId=15', {
            headers: {
                accept: 'application/json, text/plain, */*',
                'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
            },
        })
        response = http.get('http://localhost:8800/api/likes?postId=14', {
            headers: {
                accept: 'application/json, text/plain, */*',
                'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
            },
        })
        response = http.get('http://localhost:8800/api/likes?postId=6', {
            headers: {
                accept: 'application/json, text/plain, */*',
                'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
            },
        })
        response = http.get('http://localhost:8800/api/likes?postId=5', {
            headers: {
                accept: 'application/json, text/plain, */*',
                'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
            },
        })
        sleep(2.5)
        response = http.get('http://localhost:8800/api/users/find/3', {
            headers: {
                accept: 'application/json, text/plain, */*',
                'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
            },
        })
        response = http.get('http://localhost:8800/api/relationships?followedUserId=3', {
            headers: {
                accept: 'application/json, text/plain, */*',
                'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
            },
        })
    })
}
