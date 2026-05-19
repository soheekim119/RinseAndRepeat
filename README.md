# Rinse And Repeat
Point your camera at any clothing tag and get instant care instructions!

## What It Does
Upload any clothing care label and RinseAndRepeat will return structured care instructions of the wash temperature, dryer safety, bleach rules, iron settings, material type, and more. 
Supports HEIC, JPEG, PNG, and WebP formats.

**Frontend and deloyment in progress.**

## Tech Stack
| Layer | Technology |
|---|---|
| Backend | FastAPI (Python) |
| AI | Claude Sonnet Vision API |
| Image Processing | Pillow + pillow-heif |
| Deployment | Docker + GCP/AWS Cloud Run (coming soon) |
| Frontend | React + TypeScript (coming soon) |

## API Example Response
`POST /api/analyze`:
```json
{
  "wash_temperature": "cold",
  "dryer_safe": true,
  "dry_clean_only": false,
  "bleach_safe": false,
  "iron_safe": false,
  "special_instructions": "Wash with like colours only. Gentle machine wash at 30°C. Tumble dry on low heat. Do not bleach. Do not iron. Do not wring.",
  "material": "79% Polyester, 21% Elastane",
  "confidence": "high",
  "raw_summary": "Machine wash cold at 30°C on a gentle cycle with like colours only, tumble dry on low heat, do not bleach, do not iron, and do not wring or dry clean."
}
```

## Local Setup
### Prerequisites
- Python 3.11+
- Anthropic API key

  ```bash
  # Clone repo
  [git clone ...](https://github.com/soheekim119/RinseAndRepeat.git)
  cd RinseAndRepeat

  # Set up virtual environment
  cd backend
  python3 -m venv .venv
  source .venv/bin/activate

  # Install dependencies
  pip install -r requirements.txt
  ```

### Anthropic Environment Variable
  Create `backend/.env`
  ANTHROPIC_API_KEY=your-key-here

  ### Run
  ```bash
  uvicorn app.main:app --reload
  ```

  Visit `http://localhost:8000/docs` to test the POST API. GET API is for health check.

  


