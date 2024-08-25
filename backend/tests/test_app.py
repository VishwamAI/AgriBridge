import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from backend.app import app, DatabaseError, get_db_connection

client = TestClient(app)

def test_healthz():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_global_exception_handler():
    @app.get("/test-exception")
    async def test_exception():
        raise Exception("Test exception")

    response = client.get("/test-exception")
    assert response.status_code == 500
    assert response.json() == {"message": "An unexpected error occurred"}

def test_database_error_handler():
    @app.get("/test-db-error")
    async def test_db_error():
        raise DatabaseError("Test database error")

    response = client.get("/test-db-error")
    assert response.status_code == 500
    assert response.json() == {"message": "A database error occurred"}

@patch('backend.app.psycopg.connect')
def test_get_db_connection_success(mock_connect):
    mock_conn = MagicMock()
    mock_connect.return_value = mock_conn

    conn = get_db_connection()
    assert conn == mock_conn
    mock_connect.assert_called_once()

@patch('backend.app.psycopg.connect')
def test_get_db_connection_failure(mock_connect):
    mock_connect.side_effect = Exception("Connection failed")

    with pytest.raises(DatabaseError):
        get_db_connection()

@patch('backend.app.get_db_connection')
def test_db_test_success(mock_get_db_connection):
    mock_conn = MagicMock()
    mock_cursor = MagicMock()
    mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
    mock_cursor.fetchone.return_value = (1,)
    mock_get_db_connection.return_value = mock_conn

    response = client.get("/db-test")
    assert response.status_code == 200
    assert response.json() == {"message": "Database connection successful", "result": [1]}

@patch('backend.app.get_db_connection')
def test_db_test_failure(mock_get_db_connection):
    mock_get_db_connection.side_effect = DatabaseError("Test database error")

    response = client.get("/db-test")
    assert response.status_code == 500
    assert response.json() == {"detail": "Test database error"}
