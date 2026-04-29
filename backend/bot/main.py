import asyncio
import http
import logging

import uvicorn
from fastapi import FastAPI, Response
from minio import S3Error

from config import (config)
from handlers import ws_router
from constants import qdrant, s3_manager
from models import File

logging.basicConfig(level=logging.INFO if config.DEBUG else logging.ERROR)

app = FastAPI()
app.include_router(ws_router)


@app.post("/loadFiles")
async def load_files(file: File, response: Response):
    try:
        await s3_manager.process_object_stream(file.filename)
    except Exception as e:
        response.status_code = http.HTTPStatus.BAD_REQUEST
        if isinstance(e, S3Error):
            return {"error": str(e)}


async def main():
    await qdrant.setup()
    s3_manager.healthcheck()


if __name__ == "__main__":
    asyncio.run(main())

    uvicorn.run(
        app, host="0.0.0.0", port=8000, log_level="info" if config.DEBUG else "error"
    )
