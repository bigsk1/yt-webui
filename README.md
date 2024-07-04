# YT-DLP Web UI

A web-based user interface for yt-dlp, allowing easy video downloads from YouTube and other supported platforms.


![YT-WEBUI](https://imagedelivery.net/WfhVb8dSNAAvdXUdMfBuPQ/48ffe438-3815-432d-8947-8a1d361c1800/public)


## Features

- Download videos in various formats and qualities
- Extract audio from videos
- Download subtitles
- User-friendly interface for yt-dlp options
- Docker support for easy deployment

## Prerequisites

- Python 3.8+
- Node.js 18+
- FFmpeg
- Docker and Docker Compose (for Docker deployment)

## Installation


## Quick Start

1. Ensure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your system.

2. Clone this repository:
   ```
   git clone https://github.com/bigsk1/yt-webui.git
   cd yt-webui
   ```

3. Start the application:
   - On Unix-based systems (Linux, macOS):
     ```
     ./start.sh
     ```
   - Then set permission to run using: 

      ```bash
      chmod +x start.sh
      ```

   - On Windows:
     ```
     start.bat
     ```

4. Open your web browser and navigate to `http://localhost:3000` to use the application.

5. To stop the application:
   - On Unix-based systems (Linux, macOS):

   - set permission to stop using: 

      ```bash
      chmod +x stop.sh
      ```

     ```
     ./stop.sh
     ```
   - On Windows:
     ```
     stop.bat
     ```


### Local Development Setup

1. Clone the repository:
   ```
   git clone https://github.com/bigsk1/yt-webui.git
   cd yt-webui
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
   cd yt-webui
   ```

3. Build and start the Docker containers:
   ```
   docker-compose up -d --build
   ```

4. Open your browser and navigate to `http://localhost:3000`


## Use prebuilt docker images from github

To start

```bash
docker-compose -f docker-compose.external.yml up -d
```

To stop

```bash
docker-compose -f docker-compose.external.yml down
```


## Usage

1. Enter the URL of the video you want to download in the input field.
2. Select your preferred download options (format, quality, etc.).
3. Click the "Download" button to start the download process.
4. The downloaded files will be saved in the specified output directory of Downloads in the docker folder, if using native app then in Downloads folder of windows user.

On windows if you want to link the Downloads directory of your docker container to your Windows Downloads location run in project root as command prompt admin

```bash
mklink /D "%USERPROFILE%\Downloads\yt_downloads" "%CD%\docker\Downloads"
```

or as Powershell admin

```bash
New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\Downloads\yt_downloads" -Target "$PWD\docker\Downloads"
```

Then all your downloaded content will be in your windows Downloads folder in a yt_downloads folder


## Docker Commands

- Start the containers: `docker-compose up -d`
- Stop the containers: `docker-compose down`
- View logs: `docker-compose logs`
- Rebuild and start the containers: `docker-compose up -d --build`


## Notes

I know the Downloads folder in the docker folder isn't ideal for most but do to windows permission issues with docker trying to map to users downloads folder is an issue, there is work that can be done to allow it but trying to make this setup easy for most users. Hence the double click scripts to get up and going. 

you can also just symlink it but running this as admin in in command prompt the project folder

```bash
mklink /D "%USERPROFILE%\Downloads\yt_downloads" "%CD%\docker\Downloads"
```


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

