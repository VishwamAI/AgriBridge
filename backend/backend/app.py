from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import uvicorn
import psycopg
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

# Custom exception for database errors
class DatabaseError(Exception):
    def __init__(self, message: str):
        self.message = message

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    if isinstance(exc, HTTPException):
        logger.error(f"HTTP error occurred: {exc.detail}")
        return JSONResponse(
            status_code=exc.status_code,
            content={"message": exc.detail},
        )
    elif isinstance(exc, DatabaseError):
        logger.error(f"Database error occurred: {exc.message}")
        return JSONResponse(
            status_code=500,
            content={"message": "A database error occurred"},
        )
    else:
        logger.error(f"An unexpected error occurred: {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={"message": "An unexpected error occurred"},
        )

@app.get("/healthz")
async def healthz():
    logger.info("Health check endpoint called")
    return {"status": "ok"}

# Environment variable for database connection
DB_URL = os.getenv("DATABASE_URL")
if not DB_URL:
    logger.warning("DATABASE_URL is not set in the environment variables")

# Database connection function
def get_db_connection():
    try:
        conn = psycopg.connect(DB_URL)
        return conn
    except psycopg.Error as e:
        logger.error(f"Unable to connect to the database: {e}")
        raise DatabaseError("Unable to connect to the database")

# Example usage of database connection
@app.get("/db-test")
async def db_test():
    try:
        conn = get_db_connection()
        # Perform a simple query
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
            result = cur.fetchone()
        conn.close()
        return {"message": "Database connection successful", "result": result}
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))
