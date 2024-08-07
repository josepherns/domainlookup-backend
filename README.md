# Whois API Server

This is an Express.js server application that interacts with the Whois XML API to fetch domain registration details and contact information. The server accepts POST requests with a domain name and a type parameter to retrieve specific information about the domain.

## Features

- Fetches Whois data for a domain.
- Retrieves domain details or contact information based on the request.
- Formats domain age into a human-readable format.
- Handles errors and invalid requests gracefully.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v12 or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

### Configuration

Replace the following placeholders with your actual API details:

- `WHOIS_API_URL`: The URL of the Whois XML API service.
- `WHOIS_API_KEY`: Your API key for the Whois XML API.

### Usage

1. **Start the server:**

    ```bash
    npm start
    ```

    The server will start and listen on port 3000 by default.

2. **Make a POST request to the `/whois` endpoint:**

    **Request URL:**
    
    ```
    http://localhost:3000/whois
    ```

    **Request Body:**
    
    ```json
    {
      "domain": "example.com",
      "type": "domain" // or "contact"
    }
    ```

    **Response:**

    ```json
    {
      "contact": {
        "registrantContactName": "N/A",
        "technicalContactName": "N/A",
        "administrativeContactName": "N/A",
        "contactEmail": "N/A"
      },
      "domain": {
        "domainName": "example.com",
        "registrantName": "N/A",
        "createdDate": "N/A",
        "expiresDate": "N/A",
        "ageOfDomain": "0d 0h 0m 0s",
        "nameServers": []
      }
    }
    ```

### Error Handling

- Returns `400 Bad Request` if `domain` or `type` is missing, or if an invalid `type` is provided.
- Returns `500 Internal Server Error` if there is an issue with the Whois API request.

### Contributing

Feel free to open issues and pull requests if you find bugs or want to add new features. Contributions are welcome!

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
