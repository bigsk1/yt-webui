from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import yt_dlp
import os
from typing import List, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DownloadRequest(BaseModel):
    url: str
    options: List[str]
    output_dir: Optional[str] = "default"

class DownloadProgress:
    def __init__(self):
        self.current = 0
        self.total = 0

    def progress_hook(self, d):
        if d['status'] == 'downloading':
            self.current = d.get('downloaded_bytes', 0)
            self.total = d.get('total_bytes') or d.get('total_bytes_estimate', 0)

@app.post("/download/")
async def download_video(request: DownloadRequest):
    try:
        if request.output_dir == "default":
            output_dir = "/root/Downloads"
        else:
            output_dir = request.output_dir

        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        ydl_opts = {
            'outtmpl': os.path.join(output_dir, '%(title)s.%(ext)s'),
            'prefer_ffmpeg': True,
        }

        # Handle subtitle-only download
        if '--write-sub' in request.options and '--skip-download' in request.options:
            ydl_opts['writesubtitles'] = True
            ydl_opts['skip_download'] = True
            ydl_opts['subtitlesformat'] = 'vtt/srt/best'
            ydl_opts['writeautomaticsub'] = True  # Also try to download auto-generated subtitles
            if '--sub-lang' in request.options:
                lang_index = request.options.index('--sub-lang')
                ydl_opts['subtitleslangs'] = [request.options[lang_index + 1]]
        else:
            # Handle video/audio download
            if '-f' in request.options:
                format_index = request.options.index('-f')
                format_string = request.options[format_index + 1]
                
                # Handle 'best' quality separately
                if 'best' in format_string:
                    ydl_opts['format'] = format_string
                else:
                    # For specific resolutions and formats
                    ydl_opts['format'] = format_string

            if '-x' in request.options:
                ydl_opts['postprocessors'] = [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }]
                if '--audio-format' in request.options:
                    audio_format_index = request.options.index('--audio-format')
                    ydl_opts['postprocessors'][0]['preferredcodec'] = request.options[audio_format_index + 1]
                
                if '--audio-quality' in request.options:
                    audio_quality_index = request.options.index('--audio-quality')
                    ydl_opts['postprocessors'][0]['preferredquality'] = request.options[audio_quality_index + 1]

            if '--write-sub' in request.options:
                ydl_opts['writesubtitles'] = True
                ydl_opts['subtitlesformat'] = 'vtt/srt/best'
                if '--sub-lang' in request.options:
                    lang_index = request.options.index('--sub-lang')
                    ydl_opts['subtitleslangs'] = [request.options[lang_index + 1]]

        if '--write-thumbnail' in request.options:
            ydl_opts['writethumbnail'] = True

        if '--no-playlist' in request.options:
            ydl_opts['noplaylist'] = True

        # Option to keep the original file
        if '--keep-video' in request.options:
            ydl_opts['keepvideo'] = True

        progress = DownloadProgress()
        ydl_opts['progress_hooks'] = [progress.progress_hook]

        logger.info(f"Download options: {ydl_opts}")

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(request.url, download=True)

        if info:
            # Check if subtitles were actually downloaded
            if ydl_opts.get('writesubtitles') and not any(f.endswith(('.vtt', '.srt')) for f in os.listdir(output_dir)):
                return {
                    "message": "No subtitles found for the requested language",
                    "title": info.get('title', 'Unknown'),
                    "filename": ydl.prepare_filename(info),
                    "duration": info.get('duration', 'Unknown'),
                }
            else:
                return {
                    "message": "Download completed successfully",
                    "title": info.get('title', 'Unknown'),
                    "filename": ydl.prepare_filename(info),
                    "duration": info.get('duration', 'Unknown'),
                }
        else:
            raise HTTPException(status_code=500, detail="Failed to extract video information")

    except Exception as e:
        logger.exception("An error occurred during download")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)