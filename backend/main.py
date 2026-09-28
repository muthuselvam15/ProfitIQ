from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ProfitIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "ProfitIQ Backend is running"
    }

@app.get("/api/products")
def get_products():
    return {
        "products": [
            {
                "id": 1,
                "name": "Coffee Powder",
                "price": 250,
                "stock": 18
            },
            {
                "id": 2,
                "name": "Rice 5kg",
                "price": 420,
                "stock": 35
            }
        ]
    }
