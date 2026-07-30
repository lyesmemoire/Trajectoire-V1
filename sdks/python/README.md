# Blueprint SDK for Python

## Installation

```bash
pip install blueprint-sdk
```

## Quick Start

```python
from blueprint import Blueprint

bp = Blueprint()
print(bp.hello())
```

## API

### Blueprint

#### __init__()
Create a new Blueprint instance.

#### hello() -> str
Returns a greeting message.

#### get_version() -> str
Returns the SDK version.

## Building

```bash
python -m build
```

## Testing

```bash
pytest
```
