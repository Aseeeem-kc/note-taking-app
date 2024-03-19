from fastapi import FastAPI
from enum import Enum

app = FastAPI()

class AvailableCuisines(str, Enum):
    indian = "indian"
    american = "american"
    italian = "italian"

food_items = {
    'indian': ['Samosa', 'Dosa'],
    'america': ["Hot Dog", "Apple Pie"],
    'italian': ["Ravioli", "Pizza"]
}

@app.get("/get_items/{cuisine}")
def get_items(cuisine: AvailableCuisines):
    
    return food_items.get(cuisine)




coupon_code = {
    1: '10%',
    2: '20%',
    3: '30%'
}

@app.get("/get_coupon/{code}")
async def get_items(code: int):
    return {'discount_amount': coupon_code.get(code)}

