import pytest
import logging
import re
import json
from fastapi import HTTPException, APIRouter
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from backend.app import app, DatabaseError, get_db_connection, logger
from httpx import AsyncClient, ASGITransport

client = TestClient(app)

def test_healthz():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

class TestRouteContext:
    async def __aenter__(self):
        self.original_routes = list(app.router.routes)
        self.original_paths = {route.path: route for route in self.original_routes if hasattr(route, 'path')}
        logger.info(f"Initial routes: {len(self.original_routes)}")
        logger.info(f"Initial paths: {set(self.original_paths.keys())}")
        self.added_routes = {}
        self.untracked_routes = set()
        return self

    def add_test_route(self, path, endpoint, methods=None):
        if methods is None:
            methods = ["GET"]
        initial_route_count = len(app.router.routes)
        new_route = app.router.add_api_route(path, endpoint, methods=methods)
        self.added_routes[path] = new_route
        logger.info(f"Test route added: {new_route}, Path: {path}")

        # Check for any additional routes added by FastAPI
        current_route_count = len(app.router.routes)
        if current_route_count > initial_route_count + 1:
            additional_routes = app.router.routes[initial_route_count + 1:current_route_count]
            for route in additional_routes:
                if hasattr(route, 'path'):
                    self.added_routes[route.path] = route
                    logger.info(f"Additional route tracked: {route}, Path: {route.path}")

        logger.info(f"Current routes after addition: {len(app.router.routes)}")
        self.track_added_routes()

    def remove_test_route(self, path):
        if path in self.added_routes:
            route_to_remove = self.added_routes[path]
            app.router.routes = [route for route in app.router.routes if route != route_to_remove]
            del self.added_routes[path]
            logger.info(f"Test route removed: {path}")
        else:
            logger.warning(f"Attempted to remove non-existent test route: {path}")

    def track_added_routes(self):
        current_paths = {route.path for route in app.router.routes if hasattr(route, 'path')}
        new_routes = current_paths - set(self.original_paths.keys())
        for path in new_routes:
            if path not in self.added_routes:
                route = next(route for route in app.router.routes if getattr(route, 'path', None) == path)
                self.added_routes[path] = route
                logger.info(f"Tracked new route: {path}")

    def verify_route_removal(self):
        current_paths = {route.path for route in app.router.routes if hasattr(route, 'path')}
        self.untracked_routes = current_paths - set(self.original_paths.keys()) - set(self.added_routes.keys())
        if self.untracked_routes:
            logger.warning(f"Untracked routes found: {self.untracked_routes}")
        return len(self.untracked_routes) == 0

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.cleanup()

    async def cleanup(self):
        logger.info(f"Starting cleanup process. Added routes: {len(self.added_routes)}")
        try:
            # Log the initial state
            initial_routes = set(route.path for route in app.router.routes if hasattr(route, 'path'))
            logger.info(f"Initial routes: {initial_routes}")
            logger.info(f"Original routes: {set(self.original_paths.keys())}")
            logger.info(f"Added routes: {set(self.added_routes.keys())}")

            # Update added_routes to include any routes added during the test
            self.track_added_routes()

            # Remove all added routes and untracked routes
            routes_to_remove = set(self.added_routes.keys()) | self.untracked_routes
            for path in routes_to_remove:
                route = next((r for r in app.router.routes if getattr(r, 'path', None) == path), None)
                if route:
                    logger.info(f"Removing route: {path}")
                    app.router.routes = [r for r in app.router.routes if r != route]
                    if path in self.added_routes:
                        del self.added_routes[path]
                    if path in self.untracked_routes:
                        self.untracked_routes.remove(path)
                else:
                    logger.warning(f"Route not found for removal: {path}")

            # Final verification
            final_routes = set(route.path for route in app.router.routes if hasattr(route, 'path'))
            logger.info(f"Final routes: {final_routes}")

            if final_routes != set(self.original_paths.keys()):
                added = final_routes - set(self.original_paths.keys())
                removed = set(self.original_paths.keys()) - final_routes
                logger.error(f"Route mismatch. Added: {added}, Removed: {removed}")
                raise AssertionError("Routes were modified during the test.")

            if self.added_routes:
                logger.error(f"Some added routes were not removed: {self.added_routes}")
                raise AssertionError(f"Added routes not removed: {self.added_routes}")

            if self.untracked_routes:
                logger.error(f"Untracked routes remain: {self.untracked_routes}")
                raise AssertionError(f"Untracked routes remain: {self.untracked_routes}")

            logger.info("Cleanup successful. All test routes removed and original routes preserved.")
        except Exception as e:
            logger.error(f"Error during test route cleanup: {str(e)}")
            logger.error(f"Original routes: {set(self.original_paths.keys())}")
            logger.error(f"Added routes: {set(self.added_routes.keys())}")
            logger.error(f"Untracked routes: {self.untracked_routes}")
            logger.error(f"Current routes: {[route.path for route in app.router.routes if hasattr(route, 'path')]}")
            raise
        finally:
            # Ensure all routes are logged, even if an exception occurred
            logger.info(f"Final state of routes: {[route.path for route in app.router.routes if hasattr(route, 'path')]}")

    # Keep synchronous methods for backward compatibility
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        pass

@pytest.mark.skip(reason="Skipping as per user request")
@pytest.mark.asyncio
async def test_global_exception_handler(caplog):
    """
    Test the global exception handler to ensure it correctly handles unexpected exceptions,
    returns appropriate JSON responses, and logs the error details without sensitive information.
    Also verifies proper route cleanup after the test.
    """
    logger.info("Starting test_global_exception_handler")

    async with TestRouteContext() as context:
        # Define test exception handlers
        async def test_sensitive_exception():
            logger.info("Raising test exception with sensitive and non-sensitive data")
            raise Exception(
                "Test exception with mixed data:"
                "non_sensitive_data=This is not sensitive,"
                "password=VerySecretP@ssw0rd!,"
                "public_info=This should remain visible,"
                "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c,"
                "credit_card=4111-1111-1111-1111,"
                "api_key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI,"
                "database_url=postgresql://user:password@localhost/dbname,"
                "email=user@example.com"
            )

        async def test_non_sensitive_exception():
            logger.info("Raising non-sensitive test exception")
            raise Exception("Test exception")

        async def test_unhandled_exception():
            logger.info("Raising unhandled exception")
            raise ValueError("Unhandled exception")

        test_routes = {
            "/test-sensitive-exception": test_sensitive_exception,
            "/test-non-sensitive-exception": test_non_sensitive_exception,
            "/test-unhandled-exception": test_unhandled_exception
        }

        try:
            # Add test routes
            logger.info("Adding test routes")
            for route, handler in test_routes.items():
                context.add_test_route(route, handler, methods=["GET"])
                assert route in context.added_routes, f"{route} was not added"

            logger.info(f"Added routes: {context.added_routes}")

            async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
                # Test all exceptions
                for route, expected_status, verification_func in [
                    ("/test-sensitive-exception", 500, verify_sensitive_exception_response),
                    ("/test-non-sensitive-exception", 500, verify_non_sensitive_exception_response),
                    ("/test-unhandled-exception", 500, verify_unhandled_exception_response)
                ]:
                    logger.info(f"Testing {route}")
                    caplog.clear()
                    with caplog.at_level(logging.INFO):
                        response = await ac.get(route)
                        assert response.status_code == expected_status, f"Unexpected status code for {route}"
                        await verification_func(response, caplog)

                    # Verify route cleanup after each test
                    await verify_route_cleanup(context, [route])

        except Exception as e:
            logger.error(f"Unexpected error during test: {str(e)}")
            raise

        finally:
            # Ensure cleanup even if assertions fail
            logger.info("Performing final cleanup")
            await context.cleanup()

    # Final verification after context exit
    logger.info("Performing final verifications")
    assert not context.added_routes, "Some added routes were not removed"
    assert not context.untracked_routes, "Untracked routes remain"

    # Verify all original routes are still present
    current_routes = set(route.path for route in app.router.routes if hasattr(route, 'path'))
    assert current_routes == set(context.original_paths.keys()), "Original routes were modified during the test"

async def verify_unhandled_exception_response(response, caplog, context):
    assert response.status_code == 500, f"Expected status code 500, but got {response.status_code}"
    assert response.headers["content-type"] == "application/json", f"Unexpected content-type: {response.headers['content-type']}"

    response_json = response.json()
    assert set(response_json.keys()) == {"detail", "type"}, f"Unexpected keys in response JSON: {response_json.keys()}"
    assert response_json["type"] == "ValueError", f"Unexpected 'type' value: {response_json['type']}"
    assert response_json["detail"] == "Unhandled exception", f"Unexpected 'detail' value: {response_json['detail']}"

    log_text = caplog.text
    assert "Exception occurred. Type: ValueError" in log_text, "Exception type not logged"
    assert "Exception message: Unhandled exception" in log_text, "Exception message not logged"
    assert "Unexpected error occurred: Unhandled exception" in log_text, "Unexpected error message not logged"
    assert "Traceback (most recent call last):" in log_text, "Traceback not logged"
    assert "raise ValueError(\"Unhandled exception\")" in log_text, "Exception raising not found in traceback"

    logger.info("Unhandled exception response verified successfully")

async def verify_sensitive_exception_response(response, caplog):
    # Verify response status and content type
    assert response.status_code == 500, f"Expected status code 500, but got {response.status_code}"
    assert response.headers["content-type"] == "application/json", f"Unexpected content-type: {response.headers['content-type']}"

    # Verify response JSON structure
    response_json = response.json()
    assert set(response_json.keys()) == {"detail", "type"}, f"Unexpected keys in response JSON: {response_json.keys()}"
    assert response_json["type"] == "Exception", f"Unexpected 'type' value: {response_json['type']}"
    assert isinstance(response_json["detail"], str), f"'detail' is not a string: {type(response_json['detail'])}"

    # Verify redaction in detail
    expected_redacted_message = (
        "Test exception with mixed data:"
        "non_sensitive_data=This is not sensitive,"
        "password=[REDACTED],"
        "public_info=This should remain visible,"
        "token=[REDACTED],"
        "credit_card=[REDACTED],"
        "api_key=[REDACTED],"
        "database_url=[DATABASE_URL_REDACTED],"
        "email=[REDACTED]"
    )
    assert response_json["detail"] == expected_redacted_message, f"Unexpected 'detail' value: {response_json['detail']}"

    log_text = caplog.text

    # Verify sensitive information is redacted in logs
    sensitive_patterns = [
        r'VerySecretP@ssw0rd!',
        r'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        r'4111-1111-1111-1111',
        r'AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI',
        r'postgresql://user:password@localhost/dbname',
        r'user@example.com'
    ]
    for pattern in sensitive_patterns:
        assert not re.search(pattern, log_text), f"Log contains unredacted sensitive data: '{pattern}'"

    # Verify that non-sensitive data is not redacted in logs
    non_sensitive_patterns = [
        "non_sensitive_data=This is not sensitive",
        "public_info=This should remain visible",
    ]
    for pattern in non_sensitive_patterns:
        assert pattern in log_text, f"Log does not contain non-sensitive data: {pattern}"

    # Verify log messages and their order
    expected_log_messages = [
        "Starting test_global_exception_handler",
        "Raising test exception with sensitive and non-sensitive data",
        "Starting global_exception_handler",
        "Original exception message:",
        "Exception type: Exception",
        "Redacted exception message:",
        "Exception occurred. Type: Exception",
        "Request method: GET, URL: http://test/test-sensitive-exception",
        "Redacted traceback:",
        "Unexpected error occurred:",
        "Error details - Status code: 500, Type: Exception",
        "Preparing JSONResponse error response",
        "Response status code: 500",
        "Response content:",
        "Final redacted response:",
    ]
    verify_log_order(log_text, expected_log_messages)

    # Verify traceback handling
    assert "Traceback (most recent call last):" in log_text, "Traceback not found in logs"
    assert "raise Exception(" in log_text, "Exception raising not found in traceback"
    assert "Traceback" not in response_json["detail"], "Traceback should not be in the response detail"

    # Verify redacted content in logs
    assert "[REDACTED]" in log_text, "Redacted content not found in logs"
    assert "[DATABASE_URL_REDACTED]" in log_text, "Database URL redaction not found in logs"

    # Verify that the redacted exception message is logged
    assert f"Redacted exception message: {expected_redacted_message}" in log_text, "Redacted exception message not found in logs"

    # Verify that the final redacted response is logged and matches the actual response
    final_redacted_log = re.search(r'Final redacted response: (.+)', log_text)
    assert final_redacted_log, "Final redacted response not found in logs"
    final_redacted_response = json.loads(final_redacted_log.group(1))
    assert final_redacted_response == response_json, "Final redacted response does not match the actual response"

    # Additional checks for comprehensive verification
    redacted_patterns = [
        r'password=\[REDACTED\]',
        r'token=\[REDACTED\]',
        r'credit_card=\[REDACTED\]',
        r'api_key=\[REDACTED\]',
        r'email=\[REDACTED\]',
        r'database_url=\[DATABASE_URL_REDACTED\]'
    ]
    for pattern in redacted_patterns:
        assert re.search(pattern, log_text), f"Expected redacted pattern not found in logs: {pattern}"

    # Verify that sensitive information is not present in the response
    response_str = json.dumps(response_json)
    for pattern in sensitive_patterns:
        assert not re.search(pattern, response_str), f"Response contains unredacted sensitive data: '{pattern}'"

    # Verify that all sensitive patterns are properly redacted in the log
    for pattern in redacted_patterns:
        assert re.search(pattern, log_text), f"Expected redacted pattern not found in logs: {pattern}"

    # Verify that the redacted exception message is properly formatted
    assert re.search(r"Test exception with mixed data:.*?password=\[REDACTED\].*?token=\[REDACTED\]", log_text, re.DOTALL), "Redacted exception message not properly formatted in logs"

    # Verify that the redaction doesn't affect non-sensitive data
    assert "non_sensitive_data=This is not sensitive" in log_text, "Non-sensitive data was incorrectly redacted"
    assert "public_info=This should remain visible" in log_text, "Public info was incorrectly redacted"

    # Verify that the redaction is consistent throughout the log
    redacted_count = log_text.count("[REDACTED]")
    assert redacted_count >= 5, f"Expected at least 5 redactions, but found {redacted_count}"

    logger.info("Sensitive exception response verification completed successfully")

async def verify_non_sensitive_exception_response(response, caplog):
    assert response.status_code == 500, "Non-sensitive exception should return 500 status code"
    assert response.headers["content-type"] == "application/json", "Non-sensitive exception response should be JSON"

    response_json = response.json()
    assert response_json["detail"] == "Test exception", "Non-sensitive exception message should not be redacted"
    assert response_json["type"] == "Exception", "Non-sensitive exception type should be 'Exception'"

    log_text = caplog.text
    assert "Test exception" in log_text, "Non-sensitive exception message should appear in logs"
    assert "Exception occurred. Type: Exception" in log_text, "Exception type not logged for non-sensitive exception"
    assert "Redacted exception message:" in log_text, "Redacted exception message not logged for non-sensitive exception"

async def verify_route_cleanup(context):
    remaining_routes = [route.path for route in app.router.routes if hasattr(route, 'path')]
    assert "/test-sensitive-exception" not in remaining_routes, "Sensitive test route was not properly cleaned up"
    assert "/test-non-sensitive-exception" not in remaining_routes, "Non-sensitive test route was not properly cleaned up"

    assert len(app.router.routes) == len(context.original_routes), f"Route count mismatch. Expected: {len(context.original_routes)}, Actual: {len(app.router.routes)}"

    untracked_routes = set(remaining_routes) - set(context.original_paths.keys())
    assert not untracked_routes, f"Untracked routes found: {untracked_routes}"

    logger.info(f"Final routes after cleanup: {remaining_routes}")

    assert context.verify_route_removal(), "TestRouteContext cleanup failed"

    final_routes = set(route.path for route in app.router.routes if hasattr(route, 'path'))
    assert final_routes == set(context.original_paths.keys()), f"Final routes do not match original routes. Added: {final_routes - set(context.original_paths.keys())}, Removed: {set(context.original_paths.keys()) - final_routes}"

async def verify_sensitive_exception_response(response, caplog):
    # Verify response details
    assert response.status_code == 500, f"Expected status code 500, but got {response.status_code}"
    assert response.headers["content-type"] == "application/json", f"Unexpected content-type: {response.headers['content-type']}"

    # Validate response JSON structure and content
    response_json = response.json()
    assert set(response_json.keys()) == {"detail", "type"}, f"Unexpected keys in response JSON: {response_json.keys()}"
    assert response_json["type"] == "Exception", f"Unexpected 'type' value: {response_json['type']}"
    assert isinstance(response_json["detail"], str), f"'detail' is not a string: {type(response_json['detail'])}"

    # Verify redaction in detail
    expected_redacted_message = (
        "Test exception with mixed data:"
        "non_sensitive_data=This is not sensitive,"
        "password=[REDACTED],"
        "public_info=This should remain visible,"
        "token=[REDACTED],"
        "credit_card=[REDACTED],"
        "api_key=[REDACTED],"
        "database_url=[DATABASE_URL_REDACTED],"
        "email=[REDACTED]"
    )
    assert response_json["detail"] == expected_redacted_message, f"Unexpected 'detail' value: {response_json['detail']}"

    log_text = caplog.text

    # Verify sensitive information is redacted in logs
    sensitive_patterns = [
        r'VerySecretP@ssw0rd!',
        r'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        r'4111-1111-1111-1111',
        r'AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI',
        r'postgresql://user:password@localhost/dbname',
        r'user@example.com'
    ]
    for pattern in sensitive_patterns:
        assert not re.search(pattern, log_text), f"Log contains unredacted sensitive data: '{pattern}'"

    # Verify that non-sensitive data is not redacted in logs
    non_sensitive_patterns = [
        "non_sensitive_data=This is not sensitive",
        "public_info=This should remain visible",
    ]
    for pattern in non_sensitive_patterns:
        assert pattern in log_text, f"Log does not contain non-sensitive data: {pattern}"

    # Verify log messages and their order
    expected_log_messages = [
        "Starting test_global_exception_handler",
        "Raising test exception with sensitive and non-sensitive data",
        "Starting global_exception_handler",
        "Original exception message:",
        "Exception type: Exception",
        "Redacted exception message:",
        "Exception occurred. Type: Exception",
        "Request method: GET, URL: http://test/test-exception",
        "Redacted traceback:",
        "Unexpected error occurred:",
        "Error details - Status code: 500, Type: Exception",
        "Preparing JSONResponse error response",
        "Response status code: 500",
        "Response content:",
        "Final redacted response:",
    ]
    verify_log_order(log_text, expected_log_messages)

    # Verify traceback
    assert "Traceback (most recent call last):" in log_text, "Traceback not found in logs"
    assert "raise Exception(" in log_text, "Exception raising not found in traceback"
    assert "Traceback" not in response_json["detail"], "Traceback should not be in the response detail"

    # Verify redacted content in logs
    assert "[REDACTED]" in log_text, "Redacted content not found in logs"
    assert "[DATABASE_URL_REDACTED]" in log_text, "Database URL redaction not found in logs"

    # Verify that the redacted exception message is logged
    assert f"Redacted exception message: {expected_redacted_message}" in log_text, "Redacted exception message not found in logs"

    # Verify that the final redacted response is logged
    assert "Final redacted response:" in log_text, "Final redacted response not found in logs"
    final_redacted_response = json.loads(re.search(r'Final redacted response: (.+)', log_text).group(1))
    assert final_redacted_response == response_json, "Final redacted response does not match the actual response"

async def verify_non_sensitive_exception_response(response, caplog):
    assert response.status_code == 500, "Non-sensitive exception should return 500 status code"
    assert response.headers["content-type"] == "application/json", "Non-sensitive exception response should be JSON"
    response_json = response.json()
    assert response_json["detail"] == "Test exception", "Non-sensitive exception message should not be redacted"
    assert response_json["type"] == "Exception", "Non-sensitive exception type should be 'Exception'"
    assert "Test exception" in caplog.text, "Non-sensitive exception message should appear in logs"

async def verify_route_cleanup(context):
    # Ensure the test routes are properly cleaned up
    remaining_routes = [route.path for route in app.router.routes if hasattr(route, 'path')]
    assert "/test-exception" not in remaining_routes, "Test route was not properly cleaned up"
    assert "/test-non-sensitive-exception" not in remaining_routes, "Non-sensitive test route was not properly cleaned up"

    # Verify that the number of routes is back to the original count
    assert len(app.router.routes) == len(context.original_routes), f"Route count mismatch. Expected: {len(context.original_routes)}, Actual: {len(app.router.routes)}"

    # Check for any untracked routes
    untracked_routes = set(remaining_routes) - set(context.original_paths.keys())
    assert not untracked_routes, f"Untracked routes found: {untracked_routes}"

    # Log the final state of routes for debugging purposes
    logger.info(f"Final routes after cleanup: {remaining_routes}")

    # Verify that all routes added during the test are properly tracked and removed
    assert not context.added_routes, f"TestRouteContext failed to clean up all added routes: {context.added_routes}"
    assert not context.untracked_routes, f"Untracked routes found: {context.untracked_routes}"

    logger.info("All assertions passed in test_global_exception_handler")

    # Log the final state of TestRouteContext
    logger.info(f"Final state of TestRouteContext - added_routes: {context.added_routes}, original_paths: {context.original_paths}, untracked_routes: {context.untracked_routes}")

    # Verify that the TestRouteContext cleanup was successful
    assert context.verify_route_removal(), "TestRouteContext cleanup failed"

    # Additional verification for route cleanup
    final_routes = set(route.path for route in app.router.routes if hasattr(route, 'path'))
    assert final_routes == set(context.original_paths.keys()), f"Final routes do not match original routes. Added: {final_routes - set(context.original_paths.keys())}, Removed: {set(context.original_paths.keys()) - final_routes}"

def verify_log_order(log_text, expected_messages):
    last_index = -1
    for msg in expected_messages:
        current_index = log_text.index(msg)
        assert current_index > last_index, f"Log message '{msg}' is out of order"
        last_index = current_index

def verify_traceback(log_text, response_str):
    traceback_pattern = r"Traceback \(most recent call last\):.*?raise Exception\(.*?\).*?Error details"
    assert re.search(traceback_pattern, log_text, re.DOTALL), "Traceback is not properly formatted or missing in logs"
    assert "Traceback" not in response_str, "Response should not contain the full traceback"

def verify_json_response_logs(log_text, sensitive_info):
    json_response_log = log_text[log_text.index("Sending JSONResponse error response:"):]
    assert "Response status code: 500" in json_response_log, "Response status code missing in logs"
    assert "Response content:" in json_response_log, "Response content missing in logs"
    assert all(f"{key}: [REDACTED]" in json_response_log for key in sensitive_info.keys()), "Redacted response content missing in logs"

def verify_redaction(log_text, sensitive_values):
    redacted_log = re.sub(r'\[REDACTED\]', '', log_text)
    for value in sensitive_values:
        assert value not in redacted_log, f"Sensitive information '{value}' found in logs after redaction"

def verify_log_messages(log_text, expected_messages):
    for msg in expected_messages:
        assert msg in log_text, f"Expected log message not found: '{msg}'"

def verify_log_order(log_text, expected_messages):
    last_index = -1
    for msg in expected_messages:
        current_index = log_text.index(msg)
        assert current_index > last_index, f"Log message '{msg}' is out of order"
        last_index = current_index

def verify_traceback(log_text, response_str):
    traceback_pattern = r"Traceback \(most recent call last\):.*?raise Exception\(.*?\).*?Error details"
    traceback_match = re.search(traceback_pattern, log_text, re.DOTALL)
    assert traceback_match, "Traceback is not properly formatted or missing in logs"
    traceback_text = traceback_match.group()
    assert "File" in traceback_text, "Traceback should contain file information"
    assert "line" in traceback_text, "Traceback should contain line information"
    assert "in test_exception" in traceback_text, "Traceback should contain function name"
    assert "raise Exception" in traceback_text, "Traceback should show exception being raised"
    assert "Traceback" not in response_str, "Response should not contain the full traceback"

def verify_json_response_logs(log_text):
    json_response_log = log_text[log_text.index("Sending JSONResponse error response:"):]
    assert "Response status code: 500" in json_response_log, "Response status code missing in logs"
    assert "Response content:" in json_response_log, "Response content missing in logs"
    assert '"detail": "Test exception with [REDACTED]: [REDACTED] and [REDACTED]: [REDACTED]"' in json_response_log, "Redacted response content missing in logs"
    assert '"type": "Exception"' in json_response_log, "Response type missing in logs"

def verify_redaction(log_text, sensitive_info):
    redacted_log = re.sub(r'\[REDACTED\]', '', log_text)
    for info in sensitive_info:
        assert info not in redacted_log, f"Sensitive information '{info}' found in logs after redaction"

def verify_log_order(log_text, expected_messages):
    last_index = -1
    for msg in expected_messages:
        current_index = log_text.index(msg)
        assert current_index > last_index, f"Log message '{msg}' is out of order"
        last_index = current_index

def verify_traceback(log_text, response_str):
    traceback_pattern = r"Traceback \(most recent call last\):.*?raise Exception\(.*?\).*?Error details"
    traceback_match = re.search(traceback_pattern, log_text, re.DOTALL)
    assert traceback_match, "Traceback is not properly formatted or missing in logs"
    traceback_text = traceback_match.group()
    assert "File" in traceback_text, "Traceback should contain file information"
    assert "line" in traceback_text, "Traceback should contain line information"
    assert "in test_exception" in traceback_text, "Traceback should contain function name"
    assert "raise Exception" in traceback_text, "Traceback should show exception being raised"
    assert "Traceback" not in response_str, "Response should not contain the full traceback"

def verify_json_response_logs(log_text):
    json_response_log = log_text[log_text.index("Sending JSONResponse error response:"):]
    assert "Response status code: 500" in json_response_log, "Response status code missing in logs"
    assert "Response content:" in json_response_log, "Response content missing in logs"
    assert '"detail": "Test exception with [REDACTED]: [REDACTED] and [REDACTED]: [REDACTED]"' in json_response_log, "Redacted response content missing in logs"
    assert '"type": "Exception"' in json_response_log, "Response type missing in logs"

def verify_redaction(log_text, sensitive_info):
    redacted_log = re.sub(r'\[REDACTED\]', '', log_text)
    for info in sensitive_info:
        assert info not in redacted_log, f"Sensitive information '{info}' found in logs after redaction"

def verify_log_messages(log_text):
    required_log_messages = [
        "Starting test_global_exception_handler",
        "Raising test exception",
        "Exception occurred. Type: Exception",
        "Exception message: Test exception",
        "Request method: GET, URL: http://test/test-exception",
        "Traceback (most recent call last):",
        "raise Exception(\"Test exception\")",
        "Unexpected error occurred: Test exception",
        "Error details - Status code: 500, Type: Exception, Message: Test exception",
        "Sending JSONResponse error response:",
        "Response status code: 500",
        "Response content:",
    ]

    for msg in required_log_messages:
        assert msg in log_text, f"Required log message not found: {msg}"

def verify_log_order(log_text):
    log_order = [
        "Starting test_global_exception_handler",
        "Raising test exception",
        "Exception occurred. Type: Exception",
        "Exception message: Test exception",
        "Request method: GET, URL: http://test/test-exception",
        "Traceback (most recent call last):",
        "Unexpected error occurred: Test exception",
        "Error details - Status code: 500, Type: Exception, Message: Test exception",
        "Sending JSONResponse error response:",
        "Response status code: 500",
        "Response content:",
    ]
    last_index = -1
    for msg in log_order:
        current_index = log_text.index(msg)
        assert current_index > last_index, f"Log message '{msg}' is out of order"
        last_index = current_index

    # Verify that the traceback appears before the "Unexpected error occurred" message
    traceback_index = log_text.index("Traceback (most recent call last):")
    error_message_index = log_text.index("Unexpected error occurred: Test exception")
    assert traceback_index < error_message_index, "Traceback should appear before the error message in logs"

    # Verify that the full traceback is included
    assert "File" in log_text and "line" in log_text and "in test_exception" in log_text, "Full traceback details are missing"

def test_database_error_handler(caplog):
    logger.info("Starting test_database_error_handler")

    @app.get("/test-db-error")
    async def test_db_error():
        logger.info("Raising DatabaseError in test_db_error endpoint")
        raise DatabaseError("Test database error", status_code=503)

    with caplog.at_level(logging.INFO):  # Changed to capture INFO level logs
        logger.info("Sending GET request to /test-db-error")
        response = client.get("/test-db-error")
        logger.info(f"Received response with status code: {response.status_code}")
        logger.info(f"Response headers: {response.headers}")

    assert response.status_code == 503, f"Expected status code 503, but got {response.status_code}"
    response_json = response.json()
    logger.info(f"Response JSON: {response_json}")

    assert "detail" in response_json, "Response JSON missing 'detail' key"
    assert "type" in response_json, "Response JSON missing 'type' key"
    assert response_json["detail"] == "Test database error", f"Unexpected 'detail' value: {response_json['detail']}"
    assert response_json["type"] == "DatabaseError", f"Unexpected 'type' value: {response_json['type']}"
    assert len(response_json) == 2, f"Unexpected number of keys in response JSON: {len(response_json)}"
    assert response.headers["content-type"] == "application/json", f"Unexpected content-type: {response.headers['content-type']}"

    log_text = caplog.text
    logger.info(f"Full log text:\n{log_text}")

    # Use regex for more flexible log message checks
    log_checks = [
        (r"Exception occurred\. Type: DatabaseError", "DatabaseError type not found in logs"),
        (r"Exception message: Test database error", "DatabaseError message not found in logs"),
        (r"Request method: GET, URL: http://testserver/test-db-error", "Request method and URL not found in logs"),
        (r"Traceback:", "Traceback not found in logs"),
        (r"Database error occurred: Test database error", "Database error message not found in logs"),
        (r"Database error status code: 503", "Database error status code not found in logs"),
        (r"Sending JSONResponse error response:", "Error response sending message not found in logs"),
        (r"JSONResponse", "JSONResponse not mentioned in logs")
    ]

    for pattern, error_message in log_checks:
        match = re.search(pattern, log_text, re.IGNORECASE)
        if match:
            logger.info(f"Found log pattern: {pattern}")
        else:
            logger.error(f"Missing log pattern: {pattern}")
        assert match, error_message

    # Check the general order of log messages
    log_order = [
        r"Exception occurred\. Type: DatabaseError",
        r"Exception message: Test database error",
        r"Database error occurred: Test database error",
        r"Database error status code: 503",
        r"Database error details:",
        r"Request method: GET, URL: http://testserver/test-db-error",
        r"Traceback \(most recent call last\):",
        r"raise DatabaseError\(.*?\)",
        r"Sending JSONResponse error response: .*"
    ]

    last_index = -1
    for msg in log_order:
        match = re.search(msg, log_text, re.DOTALL)
        if match:
            logger.info(f"Found log message in correct order: {msg}")
            assert match.start() > last_index, f"Log message '{msg}' is out of order"
            last_index = match.start()
        else:
            logger.error(f"Missing or out of order log message: {msg}")
            assert match, f"Log message '{msg}' not found in log text"

    # Check if the traceback is properly formatted
    traceback_pattern = r"Traceback \(most recent call last\):.*?raise DatabaseError\(.*?\)"
    traceback_match = re.search(traceback_pattern, log_text, re.DOTALL)
    assert traceback_match, "Traceback not found in log text"
    traceback_text = traceback_match.group()
    logger.info(f"Found traceback:\n{traceback_text}")
    assert "File" in traceback_text, "Traceback should contain file information"
    assert "line" in traceback_text, "Traceback should contain line information"
    assert "raise DatabaseError" in traceback_text, "Traceback should show DatabaseError being raised"
    assert re.search(r"File .+, line \d+", traceback_text), "Traceback should contain file and line information in expected format"

    # Check for the absence of unexpected log messages
    assert not re.search(r"HTTP error occurred", log_text), "Log should not contain HTTP error messages for DatabaseError"

    logger.info("All assertions passed in test_database_error_handler")

def test_http_exception_handler():
    @app.get("/test-http-error-404")
    async def test_http_error_404():
        raise HTTPException(status_code=404, detail="Not found")

    response = client.get("/test-http-error-404")
    assert response.status_code == 404
    assert response.json() == {
        "detail": "Not found",
        "type": "HTTPException"
    }

    @app.get("/test-http-error-400")
    async def test_http_error_400():
        raise HTTPException(status_code=400, detail="Bad request")

    response = client.get("/test-http-error-400")
    assert response.status_code == 400
    assert response.json() == {
        "detail": "Bad request",
        "type": "HTTPException"
    }

@patch('backend.app.MongoClient')
def test_get_db_connection_success(mock_mongo_client):
    mock_client = MagicMock()
    mock_mongo_client.return_value = mock_client
    mock_client.admin.command.return_value = True  # Simulate successful ismaster command

    conn = get_db_connection()
    assert conn == mock_client
    mock_mongo_client.assert_called_once()
    mock_client.admin.command.assert_called_once_with('ismaster')

@patch('backend.app.MongoClient')
def test_get_db_connection_failure(mock_mongo_client):
    mock_mongo_client.side_effect = ConnectionFailure("Connection failed")

    with pytest.raises(DatabaseError) as exc_info:
        get_db_connection()
    assert "Unable to connect to the database: Connection failed" in str(exc_info.value)

@patch('backend.app.MongoClient')
def test_get_db_connection_timeout(mock_mongo_client):
    mock_mongo_client.side_effect = ServerSelectionTimeoutError("Server selection timeout")

    with pytest.raises(DatabaseError) as exc_info:
        get_db_connection()
    assert "Unable to connect to the database: Server selection timeout" in str(exc_info.value)

@patch('backend.app.get_db_connection')
def test_db_test_success(mock_get_db_connection):
    mock_client = MagicMock()
    mock_db = MagicMock()
    mock_collection = MagicMock()
    mock_client.GrowersGateDB = mock_db
    mock_db.Users = mock_collection
    mock_collection.find_one.return_value = {"_id": "123", "name": "Test User"}
    mock_get_db_connection.return_value = mock_client

    response = client.get("/db-test")
    assert response.status_code == 200
    assert response.json() == {"detail": "Database connection successful", "result": "{'_id': '123', 'name': 'Test User'}"}
    mock_client.close.assert_called_once()

@patch('backend.app.get_db_connection')
def test_db_test_no_documents(mock_get_db_connection):
    mock_client = MagicMock()
    mock_db = MagicMock()
    mock_collection = MagicMock()
    mock_client.GrowersGateDB = mock_db
    mock_db.Users = mock_collection
    mock_collection.find_one.return_value = None
    mock_get_db_connection.return_value = mock_client

    response = client.get("/db-test")
    assert response.status_code == 200
    assert response.json() == {"detail": "Database connection successful", "result": "No documents found in the Users collection"}
    mock_client.close.assert_called_once()

@patch('backend.app.get_db_connection')
def test_db_test_failure(mock_get_db_connection, caplog):
    logger.info("Starting test_db_test_failure")
    custom_status_code = 503
    mock_get_db_connection.side_effect = DatabaseError("Test database error", status_code=custom_status_code)
    logger.info(f"Mocked get_db_connection to raise DatabaseError with status code {custom_status_code}")

    with caplog.at_level(logging.ERROR):
        response = client.get("/db-test")

    logger.info(f"Received response with status code: {response.status_code}")
    assert response.status_code == custom_status_code

    response_json = response.json()
    logger.info(f"Response JSON: {response_json}")

    assert "detail" in response_json, "Response JSON missing 'detail' key"
    assert "type" in response_json, "Response JSON missing 'type' key"
    assert response_json["detail"] == "Test database error", f"Unexpected detail: {response_json['detail']}"
    assert response_json["type"] == "DatabaseError", f"Unexpected type: {response_json['type']}"
    assert len(response_json) == 2, f"Unexpected number of keys in response JSON: {len(response_json)}"
    assert response.headers["content-type"] == "application/json", f"Unexpected content-type: {response.headers['content-type']}"

    logger.info("Checking log messages")
    assert "Database error in db_test:" in caplog.text, "Expected log message not found"
    assert "Database error status code: 503" in caplog.text, "Expected log message not found"

    logger.info("test_db_test_failure completed successfully")
