import json
from django.core.cache import cache


def set_data(key: str, value: dict, timeout: int) -> None:
    """Store a dict in cache with TTL."""
    cache.set(key, json.dumps(value), timeout=timeout)


def get_data(key: str) -> dict | None:
    """Retrieve a dict from cache. Returns None if expired or missing."""
    data = cache.get(key)
    return json.loads(data) if data else None


def delete_data(key: str) -> None:
    """Delete a key from cache."""
    cache.delete(key)


def exists(key: str) -> bool:
    """Check if a key exists in cache."""
    return cache.get(key) is not None