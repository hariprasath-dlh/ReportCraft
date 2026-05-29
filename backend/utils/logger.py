"""
Logger — Configured Python logging for all modules.
"""

import logging
import os
import sys


def setup_logger(name: str = "reportcraft") -> logging.Logger:
    """Create and configure a logger instance."""
    log = logging.getLogger(name)

    if not log.handlers:
        log.setLevel(os.getenv("LOG_LEVEL", "INFO"))

        # Console handler
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(os.getenv("LOG_LEVEL", "INFO"))

        # Format
        formatter = logging.Formatter(
            "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        handler.setFormatter(formatter)
        log.addHandler(handler)

    return log


def get_logger(name: str) -> logging.Logger:
    """Return a configured child logger for a module."""
    return setup_logger(name)


logger = setup_logger()
