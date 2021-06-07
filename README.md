# martes-backend

This project provides the backend for the martes project. Martes is a tool to test the security configuration of MQTT Servers. The user can configure tests which should be run against the desired MQTT Server. This way, the configuration of for example access control and authorization can be tested.

## Installation

1. Clone the git repo: `git clone git@github.com:picturestone/martes-backend.git'
2. Switch into the directory: `cd martes-backend``
3. Install libraries: `npm install`
4. Start test server: `npm run dev`

TODO add build instructions and note about moving files to web server.

## Development

### Important commands:

`npm run dev` - Run node and watch for changes.
`npm run build` - TODO building with this command does not work yet.

## Basic functionality

The backend provides means to add test suite schemes with related test schemes. The schemes provide all necessary parameters for the tests. From the schemes, concrete tests can be generated. This way, the parameters only need to be set once and then the tests can be executed as often as necessary. Every test has it's own log messages. By generating a new tests from the scheme at every execution, the history of executed tests can be preserved.

## API

A postman collection `Martes.postman_collection.json` is also available in the root folder. This might be more explanatory than this API documentation.

### Add new test suite scheme

POST `localhost:{PORT}/testsuiteschemes`
e.g.: `localhost:7000/testsuiteschemes`

Example body: 
```
{
    "name": "ConnectionTests2",
    "tests": [
        {
            "testType": "connection",
            "params": {
                "host": "192.168.1.50",
                "port": 1884
            }
        },
        {
            "testType": "connection",
            "params": {
                "host": "192.168.1.51",
                "port": 3000
            }
        }
    ]
}
```

Returns: ID of new test suite scheme

### Get test suite scheme

GET `localhost:{PORT}/testsuiteschemes/{TEST SUITE SCHEME ID}`
e.g.: `localhost:7000/testsuiteschemes/1`

Returns: Test suite scheme data, e.g.:

```
{
    "name": "ConnectionTests2",
    "id": 1,
    "testSchemes": [
        {
            "id": 1,
            "testType": "connection",
            "parameters": {
                "host": "192.168.1.50",
                "port": 1884
            }
        },
        {
            "id": 2,
            "testType": "connection",
            "parameters": {
                "host": "192.168.1.51",
                "port": 3000
            }
        }
    ]
}
```

### Create executable test suite from test suite scheme

Use this route to create an executable test suite from a test suite scheme. The execution is automatically started.

POST `localhost:{PORT}/testsuites/{TEST SUITE SCHEME ID}`
e.g.: `localhost:7000/testsuites/1`

Returns: ID of new test suite

### Get test suite

GET `localhost:{PORT}/testsuites/{TEST SUITE ID}`
e.g.: `localhost:7000/testsuites/1`

Returns: Test suite data, e.g.:

```
{
    "name": "ConnectionTests2",
    "id": 1,
    "tests": [
        {
            "id": 1,
            "testType": "connection",
            "parameters": {
                "host": "192.168.1.50",
                "port": 1884
            },
            "logMessages": [
                {
                    "time": "2021-06-06T17:02:45.388Z",
                    "status": "info",
                    "message": "Starting connection with following parameters:"
                },
                {
                    "time": "2021-06-06T17:02:45.388Z",
                    "status": "info",
                    "message": "{\"host\":\"192.168.1.50\",\"port\":1884}"
                },
                {
                    "time": "2021-06-06T17:02:45.388Z",
                    "status": "info",
                    "message": "Opening connection..."
                },
                {
                    "time": "2021-06-06T17:02:47.431Z",
                    "status": "info",
                    "message": "Connection opened"
                },
                {
                    "time": "2021-06-06T17:02:47.431Z",
                    "status": "successful",
                    "message": "Test completed successfuly"
                }
            ]
        },
        {
            "id": 2,
            "testType": "connection",
            "parameters": {
                "host": "192.168.1.51",
                "port": 3000
            },
            "logMessages": [
                {
                    "time": "2021-06-06T17:02:45.429Z",
                    "status": "info",
                    "message": "Starting connection with following parameters:"
                },
                {
                    "time": "2021-06-06T17:02:45.429Z",
                    "status": "info",
                    "message": "{\"host\":\"192.168.1.51\",\"port\":3000}"
                },
                {
                    "time": "2021-06-06T17:02:45.429Z",
                    "status": "info",
                    "message": "Opening connection..."
                },
                {
                    "time": "2021-06-06T17:02:45.565Z",
                    "status": "info",
                    "message": "Connection timed out"
                },
                {
                    "time": "2021-06-06T17:02:45.565Z",
                    "status": "failed",
                    "message": "Test failed. Reason: Connection failed - check if the server is running and the parameters are correct"
                }
            ]
        }
    ]
}
```

## Logging

Log events from the tests are handled in 2 ways:

- Persisted in the database together with the test from which the event was triggered
- Emited via socket.io on the path /socket-io

The persisted events are sent in the response when accessing the "Get test suite" route.

To get log events as they happen listen to the event `log` with socket.io
For a demonstration do the following:

1. Start the server.
2. Go to the (socket io clien tool)[https://amritb.github.io/socketio-client-tool].
3. Establish connection: server url is `http://localhost:7000` (7000 is the default port for this server), JSON config is `"path": "/socket.io", "forceNew": true, "reconnectionAttempts": 3, "timeout": 2000}`.
4. Add the event `log` via the `listen to a new event...` input.
5. Execute the `Add new test suite scheme` route (not necessary if a scheme is already existant).
6. Execute the `Create executable test suite from test suite scheme` route with the desired scheme.