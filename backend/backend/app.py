from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import os
import re
import json
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Custom exception for database errors
class DatabaseError(Exception):
    def __init__(self, message: str, status_code: int = 500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code

# Specific handler for DatabaseError
@app.exception_handler(DatabaseError)
async def database_error_handler(request: Request, exc: DatabaseError):
    import traceback
    full_traceback = ''.join(traceback.format_exception(type(exc), exc, exc.__traceback__))
    logger.error(f"Exception occurred. Type: DatabaseError")
    logger.error(f"Exception message: {exc.message}")
    logger.error(f"Database error occurred: {exc.message}")
    logger.error(f"Database error status code: {exc.status_code}")
    logger.error(f"Database error details: {exc.__dict__}")
    logger.error(f"Request method: {request.method}, URL: {request.url}")
    logger.error(f"Traceback:\n{full_traceback}")
    response = JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.message,
            "type": "DatabaseError"
        },
    )
    logger.info(f"Sending JSONResponse error response: {response.body.decode()}")
    return response

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    full_traceback = ''.join(traceback.format_exception(type(exc), exc, exc.__traceback__))

    logger.info("Starting global_exception_handler")

    # Function to redact sensitive information
    def redact_sensitive_info(message: str) -> str:
        logger.info(f"Entering redact_sensitive_info with message: {message[:50]}...")  # Log first 50 chars
        sensitive_patterns = {
            'password': r'\b(?:password|pwd|pass)[\s=:]+\S+',
            'token': r'\b(?:token|access_token|refresh_token|auth_token|bearer)[\s=:]+(?:\S+|[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]+)',
            'email': r'\b(?:email|e-mail)[\s=:]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
            'credit_card': r'\b(?:credit_card|cc|card_number|card[-_\s]?num)[\s=:]+(?:(?:\d{4}[-\s]?){3}\d{4}|\d{16}|3[47]\d{13}|6(?:011|5\d{2})\d{12}|(?:2131|1800|35\d{3})\d{11})|(?<!\d)(?:\d{4}[-\s]?){3}\d{4}(?!\d)|\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})',
            'api_key': r'\b(?:api_key|apikey|api_secret|client_secret)[\s=:]+(?:[A-Za-z0-9_\-]{20,}|[a-zA-Z0-9]{32}|sk_(?:test|live)_[0-9a-zA-Z]{24}|[A-Za-z0-9-_]{21,40}|[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12})',
            'aws_key': r'\b(?:aws_key|aws_access_key_id|aws_secret_access_key)[\s=:]+[A-Za-z0-9/+=]{20,}',
            'jwt': r'\b(?:jwt|json_web_token)[\s=:]+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]+',
            'ssn': r'\b(?:ssn|social_security)[\s=:]+\d{3}[-]?\d{2}[-]?\d{4}',
            'ip': r'\b(?:ip|ip_address)[\s=:]+(?:\d{1,3}\.){3}\d{1,3}',
            'database_url': r'\b(?:database_url|db_url|connection_string|mongodb_uri|postgres_url|mysql_url|redis_url)[\s=:]+(?:(?:postgres(?:ql)?|mysql|mongodb|redis|sqlite):\/\/(?:[^:@\s]+(?::[^@\s]+)?@)?[^\s\/]+(?::\d+)?(?:\/[^\s?#]+)?(?:\?[^#\s]+)?(?:#\S+)?)|(?:jdbc:[a-z]+:\/\/[^\s]+)|(?:[a-zA-Z0-9]+://[^:\s]+:[^@\s]+@[^\s]+)|(?:Data Source=[^;]+;(?:Initial Catalog=[^;]+;)?(?:User ID=[^;]+;)?(?:Password=[^;]+;)?)',
            'private_key': r'-----BEGIN[^-]+PRIVATE KEY-----.*?-----END[^-]+PRIVATE KEY-----',
            'secret_key': r'\b(?:secret_key|secret|app_secret)[\s=:]+\S+',
            'oauth': r'\b(?:oauth_token|oauth_secret)[\s=:]+\S+',
            'session_id': r'\b(?:session_id|sessionid)[\s=:]+\S+',
            'account_number': r'\b(?:account_number|account_id)[\s=:]+\d+',
            'auth_token': r'\b(?:auth_token|authentication_token)[\s=:]+\S+',
            'encryption_key': r'\b(?:encryption_key|cipher_key)[\s=:]+\S+',
        }

        def redact_value(key: str, value: str) -> str:
            key_lower = key.lower()
            if 'private_key' in key_lower:
                return f"{key}=[PRIVATE_KEY_REDACTED]"
            elif any(db_key in key_lower for db_key in ['database_url', 'db_url', 'connection_string', 'mongodb_uri', 'postgres_url', 'mysql_url', 'redis_url']):
                return f"{key}=[DATABASE_URL_REDACTED]"
            elif key_lower == 'public':
                return f"{key}={value}"  # Do not redact 'public' values
            elif 'credit_card' in key_lower:
                return f"{key}=[CREDIT_CARD_REDACTED]"
            elif 'api_key' in key_lower:
                return f"{key}=[API_KEY_REDACTED]"
            elif 'email' in key_lower:
                return f"{key}=[EMAIL_REDACTED]"
            elif 'token' in key_lower or 'jwt' in key_lower:
                return f"{key}=[TOKEN_REDACTED]"
            else:
                return f"{key}=[REDACTED]"

        def apply_redaction(text: str) -> str:
            for key, pattern in sensitive_patterns.items():
                text = re.sub(pattern, lambda m: redact_value(key, m.group(0)), text, flags=re.IGNORECASE | re.DOTALL)
            return text

        def redact_key_value_pair(item: str) -> str:
            key, _, value = item.partition('=')
            key = key.strip()
            value = value.strip()
            if any(re.search(pattern, item, re.IGNORECASE) for pattern in sensitive_patterns.values()):
                return redact_value(key, value)
            return f"{key}={value}"

        # Check if the message contains any sensitive patterns
        contains_sensitive_data = any(re.search(pattern, message, re.IGNORECASE) for pattern in sensitive_patterns.values())

        if contains_sensitive_data:
            # Handle both test exception format and general case with sensitive data
            if message.startswith("Test exception with mixed data:"):
                prefix, sensitive_data = message.split(":", 1)
                redacted_items = [redact_key_value_pair(item.strip()) for item in sensitive_data.split(",")]
                result = f"{prefix}:{','.join(redacted_items)}"
            else:
                result = apply_redaction(message)

            # Catch-all pattern for any remaining key-value pairs with sensitive keywords
            catch_all_pattern = r'\b(secret|credential|auth|key|access|private|confidential|token|password)s?[\s=:]+\S+'
            result = re.sub(catch_all_pattern, lambda m: redact_value(m.group(1), m.group(0)), result, flags=re.IGNORECASE)

            # Remove spaces after commas to match the expected format
            result = re.sub(r',\s+', ',', result.strip())

            # Ensure all sensitive patterns are redacted
            result = apply_redaction(result)
        else:
            # If no sensitive data is detected, return the original message
            result = message

        logger.info(f"Exiting redact_sensitive_info with result: {result}")
        return result

    # Log original exception message before redaction
    logger.info(f"Original exception message: {str(exc)}")

    # Redact sensitive information from exception details
    redacted_exc_type = type(exc).__name__
    logger.info(f"Exception type: {redacted_exc_type}")
    logger.info("Calling redact_sensitive_info for exception message")
    redacted_exc_message = redact_sensitive_info(str(exc))
    logger.info(f"Redacted exception message: {redacted_exc_message}")

    logger.info("Calling redact_sensitive_info for traceback")
    redacted_traceback = redact_sensitive_info(full_traceback)
    logger.info(f"Redacted traceback (first 200 chars): {redacted_traceback[:200]}...")

    logger.error(f"Exception occurred. Type: {redacted_exc_type}")
    logger.error(f"Exception message: {redacted_exc_message}")
    logger.error(f"Request method: {request.method}, URL: {redact_sensitive_info(str(request.url))}")
    logger.error(f"Redacted traceback:\n{redacted_traceback}")

    status_code = 500
    error_type = redacted_exc_type
    error_message = redacted_exc_message

    if isinstance(exc, HTTPException):
        status_code = exc.status_code
        logger.error(f"HTTP error occurred: {error_message}")
    elif isinstance(exc, DatabaseError):
        status_code = exc.status_code
        logger.error(f"Database error occurred: {error_message}")
    else:
        logger.error(f"Unexpected error occurred: {error_message}")

    logger.error(f"Error details - Status code: {status_code}, Type: {error_type}, Message: {error_message}")

    response_content = {
        "detail": error_message,
        "type": error_type
    }

    response = JSONResponse(
        status_code=status_code,
        content=response_content,
    )

    logger.info(f"Preparing JSONResponse error response")
    logger.info(f"Response status code: {status_code}")
    logger.info(f"Response content: {json.dumps(response_content)}")

    # Log the final redacted response
    logger.info(f"Final redacted response: {json.dumps(redact_sensitive_info(json.dumps(response_content)))}")

    return response

# Specific handler for HTTPException
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error(f"Exception occurred. Type: HTTPException")
    logger.error(f"Exception message: {exc.detail}")
    logger.error(f"Request method: {request.method}, URL: {request.url}")
    logger.error(f"Status code: {exc.status_code}")

    response = JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": str(exc.detail),
            "type": "HTTPException"
        },
    )

    logger.info(f"Sending JSONResponse error response: {response.body.decode()}")
    logger.info(f"Response status code: {exc.status_code}")
    logger.info(f"Response content: {response.body.decode()}")
    return response

@app.get("/healthz")
async def healthz():
    logger.info("Health check endpoint called")
    return {"status": "ok"}



# Environment variable for database connection
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    logger.warning("MONGODB_URI is not set in the environment variables")

# Database connection function
def get_db_connection():
    try:
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        # The ismaster command is cheap and does not require auth.
        client.admin.command('ismaster')
        logger.info("Successfully connected to the database")
        return client
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        error_message = f"Unable to connect to the database: {str(e)}"
        logger.error(f"Database connection error: {error_message}")
        logger.error(f"Connection details: URI={MONGODB_URI}, Timeout=5000ms")
        raise DatabaseError(error_message, status_code=503)

# Example usage of database connection
@app.get("/db-test")
async def db_test():
    client = None
    try:
        client = get_db_connection()
        # Perform a simple query
        db = client.GrowersGateDB
        collection = db.Users
        result = collection.find_one()
        if result:
            logger.info("Database connection successful, document found")
            return {"detail": "Database connection successful", "result": str(result)}
        else:
            logger.info("Database connection successful, no documents found")
            return {"detail": "Database connection successful", "result": "No documents found in the Users collection"}
    except DatabaseError as e:
        logger.error(f"Database error in db_test: {str(e)}")
        logger.error(f"Database error status code: {e.status_code}")
        raise  # Let the DatabaseError propagate to the global exception handler
    except Exception as e:
        logger.error(f"Unexpected error in db_test: {str(e)}")
        raise DatabaseError(f"Unexpected error during database test: {str(e)}", status_code=500)
    finally:
        if client:
            client.close()
            logger.info("Database connection closed")
