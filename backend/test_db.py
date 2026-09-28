from database import engine

try:
    with engine.connect() as connection:
        print("SUCCESS: Connected to ProfitIQ PostgreSQL!")
except Exception as e:
    print("DATABASE CONNECTION FAILED")
    print(e)
