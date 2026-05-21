# Ride API

## Create Ride

### Endpoint

`POST /rides/create`

### Description

Creates a new ride request for a user.  
Calculates fare based on pickup and destination using Google Maps API.  
Returns the created ride object.

### Request Body

Send as JSON:

```json
{
  "pickup": "123 Main St, City",
  "destination": "456 Elm St, City",
  "vehicleType": "car"
}
```

#### Required Fields

- `pickup` (string, min 3 chars, required)
- `destination` (string, min 3 chars, required)
- `vehicleType` (string, one of: `car`, `motorcycle`, `auto`, required)

### Authentication

Requires a valid JWT token in the `Authorization` header as `Bearer <token>` or in the `token` cookie.

### Responses

#### Success

- **Status:** `201 Created`
- **Body:**
  ```json
  {
    "_id": "...",
    "user": "...",
    "pickup": "123 Main St, City",
    "destination": "456 Elm St, City",
    "fare": 120.5,
    "status": "pending",
    "otp": "******"
    // ...other fields
  }
  ```

#### Validation Error

- **Status:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "Invalid pickup address",
        "param": "pickup",
        "location": "body"
      }
      // ...other errors
    ]
  }
  ```

#### Missing Fields

- **Status:** `400 Bad Request`
- **Body:**
  ```json
  {
    "message": "All fields are required"
  }
  ```

#### Unauthorized

- **Status:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Authentication required"
  }
  ```

### Example

```sh
curl -X POST http://localhost:4000/rides/create \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"pickup":"123 Main St, City","destination":"456 Elm St, City","vehicleType":"car"}'
```

---

# Maps API

## Get Coordinates

### Endpoint

`GET /maps/get-coordinates?address=<address>`

### Description

Returns latitude and longitude for a given address.

### Authentication

Requires a valid JWT token in the `Authorization` header as `Bearer <token>` or in the `token` cookie.

### Query Parameters

- `address` (string, required)

### Responses

#### Success

- **Status:** `200 OK`
- **Body:**
  ```json
  {
    "lat": 12.9716,
    "lng": 77.5946
  }
  ```

#### Validation Error

- **Status:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "Address is required",
        "param": "address",
        "location": "query"
      }
    ]
  }
  ```

#### Unauthorized

- **Status:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Authentication required"
  }
  ```

### Example

```sh
curl -X GET "http://localhost:4000/maps/get-coordinates?address=123 Main St, City" \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Get Distance and Time

### Endpoint

`GET /maps/get-distance-time?origin=<origin>&destination=<destination>`

### Description

Returns distance and duration between two addresses.

### Authentication

Requires a valid JWT token in the `Authorization` header as `Bearer <token>` or in the `token` cookie.

### Query Parameters

- `origin` (string, min 3 chars, required)
- `destination` (string, min 3 chars, required)

### Responses

#### Success

- **Status:** `200 OK`
- **Body:**
  ```json
  {
    "distance": { "text": "5.2 km", "value": 5200 },
    "duration": { "text": "15 mins", "value": 900 },
    "status": "OK"
  }
  ```

#### Validation Error

- **Status:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "Invalid value",
        "param": "origin",
        "location": "query"
      }
      // ...other errors
    ]
  }
  ```

#### Unauthorized

- **Status:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Authentication required"
  }
  ```

### Example

```sh
curl -X GET "http://localhost:4000/maps/get-distance-time?origin=123 Main St, City&destination=456 Elm St, City" \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Get Address Suggestions

### Endpoint

`GET /maps/get-suggestions?input=<input>`

### Description

Returns autocomplete suggestions for address input.

### Authentication

Requires a valid JWT token in the `Authorization` header as `Bearer <token>` or in the `token` cookie.

### Query Parameters

- `input` (string, min 3 chars, required)

### Responses

#### Success

- **Status:** `200 OK`
- **Body:**
  ```json
  [
    {
      "description": "123 Main St, City, Country",
      "place_id": "..."
      // ...other fields
    }
    // ...other suggestions
  ]
  ```

#### Validation Error

- **Status:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "Invalid value",
        "param": "input",
        "location": "query"
      }
    ]
  }
  ```

#### Unauthorized

- **Status:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Authentication required"
  }
  ```

### Example

```sh
curl -X GET "http://localhost:4000/maps/get-suggestions?input=Main" \
  -H "Authorization: Bearer <jwt_token>"
```
