from fastapi import APIRouter
from starlette.websockets import WebSocket

from backend.bot.api.embeddings.processor import EmbeddingProcessor
from backend.bot.api.llm.processor import LLMProcessor
from backend.bot.config import config
from backend.bot.constants import qdrant

ws_router = APIRouter()


@ws_router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await websocket.accept()

    ep = EmbeddingProcessor(config.API_KEY)
    lp = LLMProcessor(config.API_KEY)

    while True:
        data = await websocket.receive_text()
        vector = ep.request(data)
        response = await qdrant.search(vector, data)

        # files = list(set([i.payload["file"] for i in response.points]))
        context = " ".join([list(i.payload.keys())[-1] for i in response.points])

        response = lp.request(data, context)

        await websocket.send_text(response)
