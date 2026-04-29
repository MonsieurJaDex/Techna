from openai import OpenAI

from formatters import TextFormatter


class EmbeddingProcessor:
    def __init__(self, api_key: str) -> None:
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.aitunnel.ru/v1/",
        )

    def request(self, text: str) -> list[float]:
        return (
            self.client.embeddings.create(
                model="pplx-embed-v1-0.6b",
                input=TextFormatter.cleanup(text),
                encoding_format="float",
            )
            .data[0]
            .embedding
        )
