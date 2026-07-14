#!/bin/sh
# One-time setup: point git at the repo's committed hooks directory.

git config core.hooksPath .githooks
echo "core.hooksPath set to .githooks — commit-msg enforcement is now active."
