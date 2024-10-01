# FastAPI Translation API

## Overview
The FastAPI Translation API allows you to translate text between different languages using the Google Translate service.

## Features
- Get supported languages
- Translate text
- Easy integration with web and mobile apps

## API Endpoints
- **GET `/languages`**: Returns supported languages.
- **GET `/language-options`**: Returns source and target language options.
- **POST `/translate`**: Translates text.

## Requirements
- `fastapi==0.92.0`
- `googletrans==4.0.0-rc1`
- `pydantic==1.10.6`
- `uvicorn==0.21.1`

## Usage
1. Install dependencies:
   ```bash
   pip install -r requirements.txt