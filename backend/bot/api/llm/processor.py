from openai import OpenAI


class LLMProcessor:
    def __init__(self, api_key: str) -> None:
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.aitunnel.ru/v1/",
        )

    def request(self, text: str, context: str) -> str | None:
        return (
            self.client.chat.completions.create(
                model="qwen3-30b-a3b",
                max_tokens=30000,
                messages=[
                    {
                        "role": "system",
                        "content": """
               Отвечай только на основе переданного контекста из базы знаний. Не используй внешние знания и не делай
                предположений. Если ответа нет в контексте, скажи что не знаешь и предложи обратиться в поддержку.
                 Формируй ответ на естественном языке строго по найденному контексту. В конце обязательно указывай
                  источник в виде конкретного документа и пункта (например: Основание: п. X.X <название документа> 
                  и основная часть). Ничего не выдумывай и не дополняй от себя, относись к базе знаний как к 
                  единственному источнику, трактуй только как написано. 
                """,
                    },
                    {"role": "system", "content": context},
                    {
                        "role": "user",
                        "content": text,
                    },
                ],
            )
            .choices[0]
            .message.content
        )
