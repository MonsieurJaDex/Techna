from config import config
from qdrant.engine import QdrantEngine
from s3 import S3Manager

qdrant = QdrantEngine("qdrant", 6333, "files")

s3_manager = S3Manager(
    access_key=config.S3_ACCESS_KEY,
    secret_key=config.S3_SECRET_KEY,
    host=config.S3_HOST,
    port=config.S3_PORT,
    bucket=config.S3_BUCKET,
    api_key=config.API_KEY,
    qdrant=qdrant,
)
