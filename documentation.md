# API Documentation

## Overview

This API provides services related to digital certificate signing. It allows users to generate, sign, and verify digital certificates. Here you will learn how to use this digital certificate signing API.

## Navigation

-   [Authentication](#authentication)
-   [Types](#types)
-   [Routes](#routes)
-   [Examples](#examples)
-   [Error codes](#error-codes)

## Authentication

This API currently requires no type of authentication.

## Types

Here's a list of common type models that will be used throughout the API documentation.

### ErrorResponse

-   **Values**:

"<", "<=", "==", "!=", ">=", ">", "array-contains", "in", "not-in" and "array-contains-any"

-   **Typescript definition**

```ts
type Operator =
    | "<"
    | "<="
    | "=="
    | "!="
    | ">="
    | ">"
    | "array-contains"
    | "in"
    | "not-in"
    | "array-contains-any";
```

### ErrorResponse

-   **Properties**
    -   `status` (number) - The API response status code, ranges from 400 to 599.
    -   `message` (string) - A message describing the error.
    -   `code` (string) - Pre-defined values to identify the type of error.
-   **Typescript definition**

```ts
interface ErrorResponse {
    status: number;
    message: string;
    code: string;
}
```

-   **Example**

```json
{
    "status": 404,
    "message": "Certificate not found",
    "code": "CERTIFICATE_NOT_FOUND"
}
```

### Buffer

-   **Properties**
    -   `type` ("Buffer") - The only value that can be used is the string "Buffer".
    -   `data` (Array\<number\>) - Binary data represented as an array of numbers.
-   **Typescript definition**

```ts
interface Buffer {
    type: "Buffer";
    data: number[];
}
```

-   **Example**

```json
{
    "type": "Buffer",
    "data": [0,0,0,1,1,1...]
}
```

### Metadata

-   **Properties**
    -   `[key: string]` (any) - Any key name with any possible value.
-   **Typescript definition**

```ts
interface Metadata {
    [key: string]: any;
}
```

-   **Example**

```json
{
    "user": {
        "id": "123"
    }
}
```

### Certificate

-   **Properties**

    Reference [src/models/Certificate.ts](src/models/Certificate.ts) for a class-based full list of properties.

-   **Typescript definition**

    Reference [src/models/Certificate.ts](src/models/Certificate.ts) for a class-based Typescript definition.

-   **Example**

```json
{
    "uid": "CRt-gABi4Oc1hR78aB6M29",
    "createdAt": "2024-04-11T18:56:58.070Z",
    "createdBy": "system",
    "deleted": false,
    "name": "CERTIFICATE NAME",
    "email": "JOHN.DOE@GMAIL.COM",
    "serialNumber": "123f345fvf45",
    "signatureOid": "1.2.999.123456.1.1.11",
    "validity": {
        "notBefore": "2023-06-22T20:54:45.000Z",
        "notAfter": "2024-06-22T20:54:45.000Z"
    },
    "issuer": {
        "commonName": "ISSUER NAME",
        "organizationName": "ICP-Brasil",
        "organizationalUnitName": "SAFE",
        "countryName": "BR",
        "hash": "<hash>"
    },
    "subject": {
        "commonName": "SUBJECT NAME",
        "organizationName": "ICP-Brasil",
        "organizationalUnitName": "SUBJECT ORGANIZATION NAME",
        "countryName": "BR",
        "hash": "<hash>"
    },
    "document": {
        "number": "1234567890",
        "type": "cnpj"
    },
    "filename": "My Certificate.pfx",
    "url": "https://url.to.certificate/file.pfx",
    "path": "certificates/My Certificate.pfx",
    "size": 3764,
    "type": "application/x-pkcs12",
    "metadata": {
        "user": {
            "birthdate": "1997-01-01",
            "phone": "99999999999",
            "document": "1234567890",
            "name": "John Smith",
            "email": "john.smith@gmail.com"
        }
    },
    "decrypted": true,
    "decryptedAt": "2024-04-11T18:57:45.137Z"
}
```

### SignedDocument

-   **Properties**

    Reference [src/models/SignedDocument.ts](src/models/SignedDocument.ts) for a class-based full list of properties.

-   **Typescript definition**

    Reference [src/models/SignedDocument.ts](src/models/SignedDocument.ts) for a class-based Typescript definition.

-   **Example**

```json
{
    "uid": "DOC-100SqQiN1hSd0vt9931",
    "certificate": "CRt-gABi4Oc1hR78aB6M29",
    "filename": "test.pdf",
    "url": "http://localhost:3000/api/v1/documents/DOC-100SqQiN1hSd0vt9931.pdf",
    "path": "/signed-documents/test.pdf",
    "size": 100,
    "signedAt": "2024-04-11T18:56:58.070Z",
    "metadata": {
        "process": "123",
        "user": "345"
    }
}
```

## Routes

### Certificate validation: `/certificates/validate`

-   **Method:** `POST`
-   **Description:** Validates certificate with a password.
-   **Body Parameters:**
    -   `password` (string) - Password value.
    -   `certificate` (object) - The certificate data to be evaluated.
        -   `certificate.url` (string) (optional) - The URL of the certificate. Our API will make a `GET` request to this URL if provided to retrieve the certificate buffer.
        -   `certificate.uid` (string) (optional) - If the certificate is already saved in our database, you can reference it with its UID value.
        -   `certificate.buffer` (Buffer | string) (optional) - In case you don't have access to the certificate's URL or UID, you may pass the buffer directly as a `Base64` string or `Buffer` object.
-   **Success Response:**
    -   **Code:** 200
    -   **Content:** `{ "status": 200, "message": "Certificate is valid", "code": "CERT_VALID" }`
-   **Error Response:**
    -   **Code:** 4** | 5**
    -   **Content:** `ErrorResponse`

### Save certificate: `/certificates/save`

-   **Method:** `POST`
-   **Description:** Saves a certificate to the database.
-   **Body Parameters:**
    -   `password` (string) - Password value.
    -   `certificate` (object) - The certificate data to be saved.
        -   `certificate.name` (string) - The filename of the certificate.
        -   `certificate.size` (number) - The file size in bytes.
        -   `certificate.type` (string) - The file mimetype.
        -   `certificate.metadata` (Metadata) - Any metadata you may use in your system.
        -   `certificate.url` (string) (optional) - The URL of the certificate. Our API will make a `GET` request to this URL if provided to retrieve the certificate buffer.
        -   `certificate.buffer` (Buffer | string) (optional) - In case you don't have access to the certificate's URL or UID, you may pass the buffer directly as a `Base64` string or `Buffer` object.
-   **Success Response:**
    -   **Code:** 200
    -   **Content:** `Certificate`
-   **Error Response:**
    -   **Code:** 4** | 5**
    -   **Content:** `ErrorResponse`

### Decrypt certificate: `/certificates/decrypt`

-   **Method:** `POST`
-   **Description:** Returns a certificate data to be used.
-   **Body Parameters:**
    -   `password` (string) - Password value.
    -   `certificate` (object) - The certificate data to be decrypted.
        -   `certificate.uid` (string) (optional) - If the certificate is already saved in our database, you can reference it with its UID value.
        -   `certificate.url` (string) (optional) - The URL of the certificate. Our API will make a `GET` request to this URL if provided to retrieve the certificate buffer.
        -   `certificate.buffer` (Buffer | string) (optional) - In case you don't have access to the certificate's URL or UID, you may pass the buffer directly as a `Base64` string or `Buffer` object.
-   **Success Response:**
    -   **Code:** 200
    -   **Content:** `Certificate`
-   **Error Response:**
    -   **Code:** 4** | 5**
    -   **Content:** `ErrorResponse`

### Update certificate: `/certificates/:certificateUid/update`

-   **Method:** `POST`
-   **Description:** Updates a certificate metadata.
-   **Body Parameters:**
    -   `updates` (object) - The certificate update values.
        -   `certificate.metadata` (Metadata) (optional) - The only possible value to be updated is the metadata.
-   **Success Response:**
    -   **Code:** 200
    -   **Content:** `Certificate`
-   **Error Response:**
    -   **Code:** 4** | 5**
    -   **Content:** `ErrorResponse`

### List certificates: `/certificates/list`

-   **Method:** `GET`
-   **Description:** Retrieves a list of certificates according to filters.
-   **Query Parameters:**
    -   `limit` (number | "Infinity") (optional) - The number of items to be returned. Provide the string "Infinity" if you want an unlimited list. Defaults to "Infinity".
    -   `[field: string]` (`${Operator}${string}`) - Here you can provide any key representing the certificate field you want to match and provide a value for this key that is formed by an operator and a string, for example: `?name===CERTIFICATE NAME&limit=1`, `?validity.notBefore=>=2024-04-11T18:57:45.137Z&limit=Infinity`, etc.
-   **Success Response:**
    -   **Code:** 200
    -   **Content:** `Certificate[]`
-   **Error Response:**
    -   **Code:** 4** | 5**
    -   **Content:** `ErrorResponse`

### List signed documents: `/signatures/list`

-   **Method:** `GET`
-   **Description:** Retrieves a list of documents already signed according to filters.
-   **Query Parameters:**
    -   `limit` (number | "Infinity") (optional) - The number of items to be returned. Provide the string "Infinity" if you want an unlimited list. Defaults to "Infinity".
    -   `[field: string]` (`${Operator}${string}`) - Here you can provide any key representing the certificate field you want to match and provide a value for this key that is formed by an operator and a string (`<FIELD NAME>=<OPERATOR><VALUE>`), for example: `?certificate===CERTIFICATE UID&limit=Infinity`, `?signedAt=>=2024-04-11T18:57:45.137Z&limit=Infinity`, etc.
-   **Success Response:**
    -   **Code:** 200
    -   **Content:** `SignedDocument[]`
-   **Error Response:**
    -   **Code:** 4** | 5**
    -   **Content:** `ErrorResponse`

### List signed documents: `/signatures/sign`

-   **Method:** `POST`
-   **Description:** Signs a document with a certificate.
-   **Body Parameters:**
    -   `password` (string) (optional) - Password value, is optional if you provide a value for `certificate.token`.
    -   `document` (object) - The certificate to be signed.
        -   `document.name` (string) - The filename of the document.
        -   `document.size` (number) - The file size in bytes.
        -   `document.type` (string) - The file mimetype.
        -   `document.metadata` (Metadata) (optional) - Any metadata you may use in your system.
        -   `document.url` (string) (optional) - The URL of the document. Our API will make a `GET` request to this URL if provided to retrieve the document buffer.
        -   `document.buffer` (Buffer | string) (optional) - In case you don't have access to the certificate's URL or UID, you may pass the buffer directly as a `Base64` string or `Buffer` object.token that references this certificate to be used instead of a password.
    -   `certificate` (object) - The certificate data to be used for signing.
        -   `certificate.name` (string) - The filename of the certificate.
        -   `certificate.size` (number) - The file size in bytes.
        -   `certificate.type` (string) - The file mimetype.
        -   `certificate.metadata` (Metadata) (optional) - Any metadata you may use in your system.
        -   `certificate.url` (string) (optional) - The URL of the certificate. Our API will make a `GET` request to this URL if provided to retrieve the certificate buffer.
        -   `certificate.buffer` (Buffer | string) (optional) - In case you don't have access to the certificate's URL or UID, you may pass the buffer directly as a `Base64` string or `Buffer` object.
        -   `certificate.token` (string) (optional) - In case you created a token that references this certificate to be used instead of a password.
    -   `signatory` (object) - Who's signing?
        -   `signatory.name` (string) - The signatory's name.
        -   `signatory.location` (string) - Any string describing the signatory's location.
        -   `signatory.phone` (string) - The signatory's phone number.
        -   `signatory.email` (string) - The signatory's email address.
    -   `reason` (string) - Why is this signatory signing this document?
    -   `signingTime` (string) (optional) - The datetime of signature. Defaults to current datetime.
-   **Success Response:**
    -   **Code:** 200
    -   **Content:** `SignedDocument`
-   **Error Response:**
    -   **Code:** 4** | 5**
    -   **Content:** `ErrorResponse`

## Examples

_We'll be working on this later_.

## Error Codes

Here's a list of common error codes that the API might return, along with an explanation for each.

### INTERNAL_SERVER_ERROR

Indicates that error might be on our side.

### CLIENT_ERROR

Indicates that error might be on your side.

### MISSING_PARAM_ERROR

Your request likely is missing a parameter.

### INVALID_PARAM_ERROR

Wrong parameter format.

### WRONG_CERT_PASSWORD

Provided password for certificate is invalid.

### CERTIFICATE_NOT_FOUND

We couldn't find the certificate with its provided UID.

### CERT_VALID

We inform this certificate is valid for said purposes.

### EXPIRED_TOKEN

Token already expired.

### TOKEN_NOT_FOUND

Token not found.

## Changelog

_No changes till this moment_
