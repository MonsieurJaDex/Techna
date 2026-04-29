import logging

from fastapi import APIRouter
from starlette.websockets import WebSocket

from api.embeddings.processor import EmbeddingProcessor
from api.llm.processor import LLMProcessor
from config import config
from constants import qdrant

ws_router = APIRouter()


@ws_router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    token = websocket.query_params.get("token")

    await websocket.accept()

    ep = EmbeddingProcessor(config.API_KEY)
    lp = LLMProcessor(config.API_KEY)

    while True:
        data = await websocket.receive_text()
        vector = ep.request(data)
        response = await qdrant.search(vector, data)

        if len(response.points) == 0:
            await websocket.send_text(
                "К сожалению, ответа на этот вопрос у меня нет. Обратитесь к отруднику HR отдела."
            )
            return

        # files = list(set([i.payload["file"] for i in response.points]))
        context = " ".join([list(i.payload.keys())[-1] for i in response.points])
        logging.info(context)

        response = lp.request(data, context)

        await websocket.send_text(response)
