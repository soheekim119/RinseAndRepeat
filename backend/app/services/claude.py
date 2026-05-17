import os
import base64
import json
import anthropic
from PIL import Image
from pillow_heif import register_heif_opener
import io

register_heif_opener()
Image.MAX_IMAGE_PIXELS = 20_000_000

PROMPT = """
You are a laundry and garment care expert. Analyze this image and extract all care instructions.

Return ONLY a JSON object with these exact keys, no markdown, no explanation:
{
  "wash_temperature": "cold / warm / hot / do not wash / null",
  "dryer_safe": true or false or null,
  "dry_clean_only": true or false,
  "bleach_safe": true or false or null,
  "iron_safe": true or false or null,
  "special_instructions": "any extra notes or null",
  "material": "fabric type if visible or null",
  "confidence": "high / medium / low",
  "raw_summary": "one plain English sentence summarizing care instructions"
}
"""

def convert_to_jpeg(image_bytes: bytes) -> bytes:
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()
    except Exception:
        raise ValueError("Invalid or corrupted image file")
    
    img = Image.open(io.BytesIO(image_bytes))
    output = io.BytesIO()
    img.convert("RGB").save(output, format="JPEG")
    return output.getvalue()

async def analyze_image(image_bytes: bytes, media_type: str = "image/jpeg") -> dict:
    client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    image_bytes = convert_to_jpeg(image_bytes)
    media_type = "image/jpeg"
    b64 = base64.standard_b64encode(image_bytes).decode("utf-8")

    message = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": b64,
                        },
                    },
                    {"type": "text", "text": PROMPT},
                ],
            }
        ],
    )

    text = message.content[0].text
    text = text.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(text)