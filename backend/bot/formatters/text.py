import re
from abc import ABC, abstractmethod


class TextFormatter(ABC):
    @staticmethod
    def cleanup(text: str) -> str:
        text = text.lower()
        text = re.sub(r"[^\w\s]", "", text)
        text = text.replace("_", "")
        return re.sub(r"\s+", " ", text).strip()
