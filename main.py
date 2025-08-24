from fastapi import FastAPI
import uvicorn

# FastAPI app instance
app = FastAPI(
    title="DevBoss API",
    description="API for the multi-agent AI IT Manager.",
    version="0.1.0"
)

@app.get("/")
def read_root():
    """A simple endpoint to confirm the server is running."""
    return {"status": "ok", "message": "Apka swagat hai 😚 !"}

# This allows running the app directly with `python main.py`
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)