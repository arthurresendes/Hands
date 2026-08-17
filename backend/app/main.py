from fastapi import FastAPI

app = FastAPI(title="Hands API")

@app.get("/")
def read_root():
    return {
        "message": "Hello World! Hands API está rodando no Docker!",
        "status": "online"
    }