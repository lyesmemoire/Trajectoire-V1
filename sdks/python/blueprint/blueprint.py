"""
Blueprint SDK main module
"""

class Blueprint:
    def __init__(self):
        self.version = "1.0.0"
    
    def hello(self) -> str:
        """Returns a greeting message."""
        return "Hello from Blueprint SDK!"
    
    def get_version(self) -> str:
        """Returns the SDK version."""
        return self.version
