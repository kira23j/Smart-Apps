from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import spacy
from typing import Dict, List

# Initialize the FastAPI app
app = FastAPI()

# Load the spaCy English model
nlp = spacy.load("en_core_web_sm")

# Predefined FAQs about Ethiopia
faqs: Dict[str, str] = {
    "Where is Ethiopia?": "Ethiopia is located in the Horn of Africa, bordered by Eritrea, Djibouti, Somalia, Kenya, South Sudan, and Sudan.",
    "What is the capital of Ethiopia?": "The capital city of Ethiopia is Addis Ababa, which is also the political and cultural hub of Africa.",
    "What is Ethiopia known for?": "Ethiopia is known for its rich history, being the origin of coffee, ancient civilizations, and stunning landscapes like the Simien Mountains.",
    "What language is spoken in Ethiopia?": "Amharic is the official language, but there are over 80 languages spoken across Ethiopia.",
    "What is the Ethiopian calendar?": "The Ethiopian calendar is unique and is about 7-8 years behind the Gregorian calendar. It also has 13 months.",
    "What is Ethiopian cuisine like?": "Ethiopian cuisine is famous for injera (sour flatbread) served with various stews like Doro Wat (chicken stew).",
    "What is the climate in Ethiopia?": "Ethiopia has diverse climates, from cool highlands to hot deserts, making it a country of many weather extremes.",
    "What is Lalibela?": "Lalibela is a town known for its monolithic rock-cut churches, a significant historical and religious site in Ethiopia.",
    "Is Ethiopia safe for tourists?": "Ethiopia is generally safe for tourists, with many historical and natural attractions. However, like any country, caution is advised in certain areas.",
    "What currency is used in Ethiopia?": "The official currency of Ethiopia is the Ethiopian Birr (ETB)."
}

# Function to preprocess text using spaCy (lemmatization, stop word and punctuation removal)
def preprocess_text(text: str) -> List[str]:
    doc = nlp(text)
    tokens = [token.lemma_ for token in doc if not token.is_punct and not token.is_stop]
    return tokens

# Function to generate an FAQ response based on the user's question
def get_faq_answer(question: str) -> str:
    question_tokens = preprocess_text(question)
    best_score = -1
    best_response = ""

    for faq_question, faq_answer in faqs.items():
        faq_tokens = preprocess_text(faq_question)
        score = sum(1 for token in question_tokens if token in faq_tokens)

        if score > best_score:
            best_score = score
            best_response = faq_answer

    return best_response

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow the Next.js app
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Basic route to check if the API is working
@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Ethiopia FAQ API"}

# Endpoint to fetch the list of questions
@app.get("/faq/questions", tags=["FAQ"])
def get_questions():
    questions = list(faqs.keys())
    return {"questions": questions}

# Endpoint to fetch an FAQ response based on the question
@app.get("/faq/{question}", tags=["FAQ"])
def faq(question: str):
    answer = get_faq_answer(question)
    if answer:
        return {"question": question, "answer": answer}
    else:
        raise HTTPException(status_code=404, detail="Sorry, I don't have an answer for that question.")
