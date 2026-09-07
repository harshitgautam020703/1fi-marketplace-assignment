from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .routers import products

app = FastAPI(
    title="1Fi Marketplace API",
    description="Mock backend serving product and EMI data for the 1Fi Marketplace assignment.",
    version="1.0.0",
)

# Wide-open CORS is fine for a local mock API consumed by an Expo dev client.
# A real deployment would lock this down to known origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Something went wrong on our end. Please try again."},
    )


@app.get("/health")
def health():
    return {"status": "ok"}
