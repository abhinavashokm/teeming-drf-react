import json
import hashlib
from django.core.cache import cache


def make_key(prefix, identifier):
    """make key for securly storing reset token to redis"""
    hashed_identifier = hashlib.sha256(str(identifier).lower().encode()).hexdigest()
    return f"{prefix}:{hashed_identifier}"


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


def add_to_set(key: str, value: str) -> None:
    """Add a value to a Redis set."""
    cache.client.get_client().sadd(key, value)


def remove_from_set(key: str, value: str) -> None:
    """Remove a value from a Redis set."""
    cache.client.get_client().srem(key, value)


def get_set_members(key: str) -> list[str]:
    """Return all members of a Redis set."""
    members = cache.client.get_client().smembers(key)
    return [
        member.decode() if isinstance(member, bytes) else member
        for member in members
    ]