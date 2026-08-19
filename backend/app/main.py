from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.api.endpoint.routes_padrao import router
import uvicorn

app = FastAPI(title="Hands - Marktplace", version="1.0")
app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)