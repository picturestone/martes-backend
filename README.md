# martes-backend

This project provides the backend for the martes project. Martes is a tool to test the security configuration of MQTT Servers. The user can configure tests which should be run against the desired MQTT Server. This way, the configuration of for example access control and authorization can be tested.

## Installation - Production

1. Clone the git repo: `git clone git@github.com:picturestone/martes-backend.git`
2. Switch into the directory: `cd martes-backend`
3. Copy the .env.example file and call it .env: `cp .env.example .env`
4. Change the .env file to fit your needs
5. Install dependencies: `npm install`
6. Build the backend for production: `npm run build`
7. Start backend: `npm run start`

## Installation - Development

1. Clone the git repo: `git clone git@github.com:picturestone/martes-backend.git`
2. Switch into the directory: `cd martes-backend`
3. Copy the .env.example file and call it .env: `cp .env.example .env`
4. Change the .env file to fit your needs
5. Install dependencies: `npm install`
6. Start the test server and watch for changes: `npm run dev`

## Development

### Important commands:

`npm run dev` - Run node and watch for changes.
`npm run build` - Build backend for production. Output is in `bin` folder.
`npm run start` - Start the backend in production.

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

### Get all test suite schemes

GET `localhost:{PORT}/testsuiteschemes`
e.g.: `localhost:7000/testsuiteschemes`

Returns: All test suite scheme ids and names in an array (note: testSchemes array is always empty), e.g.:

```
[
    {
        "name": "ConnectionTests2",
        "id": 1,
        "testSchemes": []
    },
    {
        "name": "ConnectionTests1",
        "id": 2,
        "testSchemes": []
    }
]
```

### Edit existing test suite scheme

PUT `localhost:{PORT}/testsuiteschemes/{TEST SUITE SCHEME ID}`
e.g.: `localhost:7000/testsuiteschemes/1`

Data is updated in the following way:
- The testsuite scheme with the ID from the URL gets the updated name and all test schemes sent in the body are updated
- If a test scheme is sent with an ID, the test scheme with the sent ID gets updated
- If a test scheme is sent without an ID, the test scheme is inserted into the database as a new test scheme for the test suite scheme
- If the test suite scheme has any test schemes for which a test scheme with the corresponding ID is not sent, the test scheme is deleted

Example body: 
```
{
    "name": "ConnectionTestsUpdated",
    "testSchemes": [
        {
            "id": 1,
            "testType": "connection",
            "params": {
                "host": "192.168.0.25",
                "port": 1884
            }
        },
        {
            "testType": "connection",
            "params": {
                "host": "10.0.0.1",
                "port": 3000
            }
        }
    ]
}
```

Returns: ID of new test suite scheme

#### Further explanation by example

In this example 4 requests are made:
1. A new test suite scheme is added
2. The data of the new test suite scheme is inspected
3. The new test suite scheme gets updated with different data
4. The data of the updated test suite scheme is inspected

**Request 1:** Sending `POST` to `localhost:7000/testsuiteschemes` with the follwing body:
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
Returns: `1`

**Request 2:** Sending `GET` to `localhost:7000/testsuiteschemes/1` returns: 
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

**Request 3:** Sending `PUT` to `localhost:7000/testsuiteschemes/1` with the following body:
```
{
    "name": "ConnectionTestsUpdated",
    "testSchemes": [
        {
            "id": 1,
            "testType": "connection",
            "params": {
                "host": "192.168.0.25",
                "port": 1884
            }
        },
        {
            "testType": "connection",
            "params": {
                "host": "10.0.0.1",
                "port": 3000
            }
        }
    ]
}
```
Returns: `1`

**Request 4:** Sending `GET` to `localhost:7000/testsuiteschemes/1` returns: 
```
{
    "name": "ConnectionTestsUpdated",
    "id": 1,
    "testSchemes": [
        {
            "id": 1,
            "testType": "connection",
            "parameters": {
                "host": "192.168.0.25",
                "port": 1884
            }
        },
        {
            "id": 3,
            "testType": "connection",
            "parameters": {
                "host": "10.0.0.1",
                "port": 3000
            }
        }
    ]
}
```

What happened?
- The test scheme suite changed its name.
- The test scheme with ID 1 is updated (because in put a test scheme with id 1 is sent).
- A new test scheme got added (ID 3) because in put a test scheme without an id is sent.
- The test scheme with ID 2 is removed (because in put no test scheme with id 2 is sent).

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

### Get all test suites

GET `localhost:{PORT}/testsuites`
e.g.: `localhost:7000/testsuites`

Returns: All test suites ids and names in an array (note: tests array is always empty), e.g.:

```
[
    {
        "name": "ConnectionTests2",
        "id": 1,
        "tests": []
    },
    {
        "name": "ConnectionTests2",
        "id": 2,
        "tests": []
    },
    {
        "name": "ConnectionTests1",
        "id": 3,
        "tests": []
    }
]
```

## Logging

Log events from the tests are handled in 2 ways:

- Persisted in the database together with the test from which the event was triggered
- Emited via socket.io on the path `/socket-io`. The objects received here have the testId parameter so it is clear to which test a log message belongs.

The persisted events are sent in the response when accessing the "Get test suite" route.

To get log events as they happen listen to the event `log` with socket.io
For a demonstration do the following:

1. Start the server.
2. Go to the (socket io clien tool)[https://amritb.github.io/socketio-client-tool].
3. Establish connection: server url is `http://localhost:7000` (7000 is the default port for this server), JSON config is `"path": "/socket.io", "forceNew": true, "reconnectionAttempts": 3, "timeout": 2000}`.
4. Add the event `log` via the `listen to a new event...` input.
5. Execute the `Add new test suite scheme` route (not necessary if a scheme is already existant).
6. Execute the `Create executable test suite from test suite scheme` route with the desired scheme.

A log message is a JSON containing the following:

```
{
    "id": <number - unique id per test>,
    "time": <string - time where the event was created>,
    "status": <string - one of the following values: 'info', 'failed', 'successful', 'error'>,
    "message": <string - log message>
}
```

Example:

```
{
    "id": 1,
    "time": "2021-06-06T17:02:45.388Z",
    "status": "info",
    "message": "Opening connection..."
}
```
