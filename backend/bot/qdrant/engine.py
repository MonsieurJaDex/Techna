import uuid

from qdrant_client import AsyncQdrantClient
from qdrant_client.http.models import PointStruct, QueryResponse
from qdrant_client.models import VectorParams, Distance


class QdrantEngine:
    def __init__(self, host: str, port: int, collection: str):
        self.client = AsyncQdrantClient(host=host, port=port)
        self.collection = collection

    async def setup(self) -> None:
        collections = await self.client.get_collections()

        names = [c.name for c in collections.collections]

        if self.collection not in names:
            await self.client.create_collection(
                collection_name=self.collection,
                vectors_config=VectorParams(size=1024, distance=Distance.COSINE),
            )

    async def add_vector(
        self, vector: list[float], file: str, chunk: int, text: str
    ) -> None:
        await self.client.upsert(
            collection_name=self.collection,
            points=[
                PointStruct(
                    id=uuid.uuid4(),
                    vector=vector,
                    payload={"file": file, "chunk": chunk, text: text},
                )
            ],
        )

    async def search(self, query_vector: list[float], text: str) -> QueryResponse:
        result = await self.client.query_points(
            collection_name=self.collection,
            query=query_vector,
            limit=5,
            with_payload=True,
        )

        return result
