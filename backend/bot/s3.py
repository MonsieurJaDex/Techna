import logging
import sys

from minio import Minio

from backend.bot.api.embeddings.processor import EmbeddingProcessor
from backend.bot.formatters import TextFormatter
from backend.bot.qdrant.engine import QdrantEngine


class S3Manager:
    def __init__(
        self,
        access_key: str,
        secret_key: str,
        host: str,
        port: int,
        bucket: str,
        api_key: str,
        qdrant: QdrantEngine,
    ) -> None:
        self.client = Minio(
            endpoint=f"{host}:{port}",
            access_key=access_key,
            secret_key=secret_key,
            cert_check=False,
            secure=False,
        )
        self.bucket = bucket
        self.embeddingProcessor = EmbeddingProcessor(api_key=api_key)
        self.qdrant = qdrant

    def healthcheck(self) -> None:
        if not self.client.bucket_exists(self.bucket):
            logging.error(f"Bucket {self.bucket}: healthcheck failed")
            sys.exit(-1)
        logging.info(f"Bucket {self.bucket}: healthcheck passed")

    async def process_object_stream(
        self, object_name: str, chunk_size: int = 16 * 1024
    ):
        stream = self.client.get_object(
            object_name=object_name, bucket_name=self.bucket
        ).stream(chunk_size)

        chunk_num = 0

        for chunkBytes in stream:
            chunk = chunkBytes.decode("utf-8", errors="ignore")
            chunk = TextFormatter.cleanup(chunk)

            vector = self.embeddingProcessor.request(chunk)

            chunk_num += 1
            await self.qdrant.add_vector(vector, object_name, chunk_num, chunk)

        return self.client.get_object(self.bucket, object_name).stream(chunk_size)
