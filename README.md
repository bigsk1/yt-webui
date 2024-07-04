# YT-DLP Web UI

A web-based user interface for yt-dlp, allowing easy video downloads from YouTube and other supported platforms.

## Features

- Download videos in various formats and qualities
- Extract audio from videos
- Download subtitles
- User-friendly interface for yt-dlp options
- Docker support for easy deployment

## Prerequisites

- Python 3.8+
- Node.js 14+
- FFmpeg
- Docker and Docker Compose (for Docker deployment)

## Installation

### Local Development Setup

1. Clone the repository:
   ```
   git clone https://github.com/bigsk1/yt-webui.git
   cd yt-dlp-web-ui
   ```

2. Install backend dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Install frontend dependencies:
   ```
   npm install
   ```

4. Start the backend server:
   ```
   uvicorn main:app --reload
   ```

5. In a new terminal, start the frontend development server:
   ```
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000`

### Docker Deployment

1. Make sure you have Docker and Docker Compose installed on your system.

2. Clone the repository:
   ```
   git clone https://github.com/bigsk1/yt-webui.git
   cd yt-dlp-web-ui
   ```

3. Build and start the Docker containers:
   ```
   docker-compose up -d --build
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter the URL of the video you want to download in the input field.
2. Select your preferred download options (format, quality, etc.).
3. Click the "Download" button to start the download process.
4. The downloaded files will be saved in the specified output directory.

## Docker Commands

- Start the containers: `docker-compose up -d`
- Stop the containers: `docker-compose down`
- View logs: `docker-compose logs`
- Rebuild and start the containers: `docker-compose up -d --build`
