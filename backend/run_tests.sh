#!/bin/bash

# Check if MONGODB_URI is set
if [ -z "$MONGODB_URI" ]; then
    # If not set, try to load from .env file
    if [ -f .env ]; then
        export $(grep -v '^#' .env | xargs)
    fi

    # If still not set, use a default value
    if [ -z "$MONGODB_URI" ]; then
        echo "MONGODB_URI is not set. Using default value."
        export MONGODB_URI="mongodb://localhost:27017/growers_gate"
    fi
fi

# Run the tests
poetry run pytest
